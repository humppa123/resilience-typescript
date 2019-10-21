import { IResilienceProxy } from "../contracts/resilienceProxy";

/**
 * Base class for all maintenace items.
 */
export abstract class AbstractMaintenanceItem {
    /**
     * Gets all current used proxies.
     */
    protected readonly proxies: IResilienceProxy[];

    /**
     * Initializes a new instance of the @see AbstractMaintenanceItem class.
     * @param proxies Proxies to use for maintenance.
     */
    protected constructor(proxies: IResilienceProxy[]) {
        this.proxies = proxies || [];
    }
}
