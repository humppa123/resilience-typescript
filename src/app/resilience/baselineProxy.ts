import { TimeSpansInMilliSeconds } from "../utils/timespans";
import { ILogger } from "../contracts/logger";
import { Guard } from "../utils/guard";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guid } from "guid-typescript";
import { timer } from "../utils/timer";
import { logFormatter } from "./utils";

/**
 * A proxy that calculates an alarm level and sends warnings to logs.
 */
export class BaselineProxy implements IResilienceProxy {
    /**
     * Gets a date after when sampling should start. Use this if server needs a longer time to start.
     */
    private readonly startSamplingAfter: Date;
    /**
     * Gets the list of samples.
     */
    private readonly samples: number[];
    /**
     * Gets the maximum number of samples.
     */
    private readonly maxSamplesCount: number;
    /**
     * Gets a date after which sampling is finished.
     */
    private readonly maxSampleDuration: Date;
    /**
     * Gets the logger.
     */
    private readonly logger: ILogger<string>;
    /**
     * Gets or sets a value indicating whether sampling is finished.
     */
    private isSamplingFinished: boolean;
    /**
     * Gets or sets the alarm level.
     */
    private alarmLevel: number;
    /**
     * Gets or sets the current average request duration.
     */
    private avg: number;
    /**
     * Gets or sets the current minimum request duration.
     */
    private min: number;
    /**
     * Gets or sets the current maximum request duration.
     */
    private max: number;

    /**
     * Initializes a new instance of the @see BaselineProxy class.
     * @param startSamplingAfter A timespan after when sampling should start. Use this if server needs a longer time to start.
     * @param maxSampleDuration A timespan within samples should be gathered after sampling start.
     * @param maxSamplesCount The maximum number of samples.
     * @param logger Logger to use.
     */
    constructor(
        startSamplingAfter: number = TimeSpansInMilliSeconds.TenMinutes,
        maxSampleDuration: number = TimeSpansInMilliSeconds.TenMinutes,
        maxSamplesCount: number = 100,
        logger: ILogger<string>) {
        Guard.throwIfNullOrNegative(startSamplingAfter, "startSamplingAfter");
        Guard.throwIfNullOrNegative(maxSampleDuration, "maxSampleDuration");
        Guard.throwIfNullOrNegative(maxSamplesCount, "maxSamplesCount");
        Guard.throwIfNullOrEmpty(logger, "logger");

        const now = new Date();
        this.startSamplingAfter = new Date(now.getTime() + startSamplingAfter);
        this.samples = [];
        this.maxSamplesCount = maxSamplesCount;
        this.maxSampleDuration = new Date(now.getTime() + startSamplingAfter + maxSampleDuration);
        this.isSamplingFinished = false;
        this.alarmLevel = 0;
        this.logger = logger;
        this.avg = 0;
        this.min = Number.MAX_SAFE_INTEGER;
        this.max = Number.MIN_SAFE_INTEGER;
    }

    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @param guid Request Guid.
     * @returns The result of the executed function.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, guid: Guid): Promise<TResult> {
        const durationTimer = timer();
        const result = await func();
        const milliseconds = durationTimer.milliSeconds;
        this.sample(milliseconds);
        if (this.isSamplingFinished) {
            if (this.alarmLevel > 0 && milliseconds >= this.alarmLevel) {
                this.logger.warning(guid, `returned above alarm level in ${milliseconds}/${this.alarmLevel}ms ${this.getStatisticsString()}`, null, logFormatter);
            } else {
                this.logger.information(guid, `returned in ${milliseconds}/${this.alarmLevel}ms ${this.getStatisticsString()}`, null, logFormatter);
            }
        } else {
            this.logger.information(guid, `returned in ${milliseconds}ms. Sampling ongoing.`, null, logFormatter);
        }

        return result;
    }

    /**
     * Gets a readable string from the statistics.
     * @returns A readable string from the statistics.
     */
    private getStatisticsString(): string {
        return `AVG = ${this.avg} MIN = ${this.min} MAX = ${this.max}`;
    }

    /**
     * Does the sampling and statistics calculation.
     * @param value Sample value to add.
     */
    private sample(value: number): void {
        if (this.isSamplingFinished) {
            if (this.avg === 0) {
                this.avg = value;
            } else {
                this.avg += value;
                this.avg = Math.ceil(this.avg /= 2);
            }

            if (value < this.min) {
                this.min = value;
            }

            if (value > this.max) {
                this.max = value;
            }

            return;
        }

        const now = new Date().getTime();
        if (now < this.startSamplingAfter.getTime()) {
            return;
        }

        if (now > this.maxSampleDuration.getTime() || this.samples.length >= this.maxSamplesCount) {
            this.calculateAlarmLevel();
            this.isSamplingFinished = true;
        } else {
            this.samples.push(value);
        }
    }

    /**
     * Calculates the alarm level.
     */
    private calculateAlarmLevel() {
        const mean = this.calculateMean();
        const sdev = this.calculateStandardDeviation(mean);
        const level = 1.2 * mean + 3 * sdev;
        if (!level) {
            this.alarmLevel = 0;
        } else {
            this.alarmLevel = Math.floor(level);
        }
    }

    /**
     * Calculates the mean of the samples.
     * @returns The mean of the samples.
     */
    private calculateMean(): number {
        if (this.samples.length > 0) {
            return this.samples.reduce( ( p, c ) => p + c, 0 ) / this.samples.length;
        }

        return 0;
    }

    /**
     * Calculates the standard deviation of the samples.
     * @param mean Mean value of samples.
     * @returns The standard deviation of the samples.
     */
    private calculateStandardDeviation(mean: number): number {
        if (this.samples.length <= 0) {
            return 0;
        }

        const variance = this.calculateVariance(mean);
        return Math.sqrt(variance);
    }

    /**
     * Calculates the variance of the samples.
     * @param mean Mean value of samples.
     * @returns The variance of the samples.
     */
    private calculateVariance(mean: number): number {
        if (this.samples.length <= 0) {
            return 0;
        }

        let variance = 0;
        for (let i = 0; i < this.samples.length; i++) {
            variance += Math.pow(this.samples[i] - mean, 2);
        }

        variance /= this.samples.length - 1;
        return variance;
    }
}
