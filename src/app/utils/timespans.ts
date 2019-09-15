export class TimeSpansInMilleSeconds {
    // Min + max
    public static readonly MINIMUM = 0;
    public static readonly MAXIMUM = Number.MAX_SAFE_INTEGER;

    // Milli seconds
    public static readonly OneHundredMilliSeconds = 100;
    public static readonly TwoHundredMilliSeconds = 2 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly ThreeHundredMilliSeconds = 3 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly FourHundredMilliSeconds = 4 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly FiveHundredMilliSeconds = 5 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly SixHundredMilliSeconds = 6 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly SevenHundredMilliSeconds = 7 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly EightHundredMilliSeconds = 8 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly NineHundredMilliSeconds = 9 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    // Seconds
    public static readonly OneSecond = 10 * TimeSpansInMilleSeconds.OneHundredMilliSeconds;
    public static readonly TwoSeconds = 2 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly ThreeSeconds = 3 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly FourSeconds = 4 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly FiveSeconds = 5 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly SixSeconds = 6 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly SevenSeconds = 7 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly EightSeconds = 8 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly NineSeconds = 9 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly TenSeconds = 10 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly TwentySeconds = 20 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly ThirtySeconds = 30 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly FourtySeconds = 40 * TimeSpansInMilleSeconds.OneSecond;
    public static readonly FithtySeconds = 50 * TimeSpansInMilleSeconds.OneSecond;
    // Minutes
    public static readonly OneMinute = 60 + TimeSpansInMilleSeconds.OneSecond;
    public static readonly TwoMinutes = 2 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly ThreeMinutes = 3 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly FourMinutes = 4 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly FiveMinutes = 5 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly SixMinutes = 6 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly SevenMinutes = 7 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly EightMinutes = 8 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly NineMinutes = 9 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly TenMinutes = 10 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly TwentyMinutes = 20 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly ThirtyMinutes = 30 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly FourtyMinutes = 40 + TimeSpansInMilleSeconds.OneMinute;
    public static readonly FithtyMinutes = 50 + TimeSpansInMilleSeconds.OneMinute;
    // Hours
    public static readonly OneHour = 60 * TimeSpansInMilleSeconds.OneMinute;
    public static readonly TwoHours = 2 * TimeSpansInMilleSeconds.OneHour;
    public static readonly ThreeHours = 3 * TimeSpansInMilleSeconds.OneHour;
    public static readonly FourHours = 4 * TimeSpansInMilleSeconds.OneHour;
    public static readonly FiveHours = 5 * TimeSpansInMilleSeconds.OneHour;
    public static readonly SixHours = 6 * TimeSpansInMilleSeconds.OneHour;
    public static readonly SevenHours = 7 * TimeSpansInMilleSeconds.OneHour;
    public static readonly EightHours = 8 * TimeSpansInMilleSeconds.OneHour;
    public static readonly NineHours = 9 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TenHours = 10 * TimeSpansInMilleSeconds.OneHour;
    public static readonly ElevenHours = 11 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwelveHours = 12 * TimeSpansInMilleSeconds.OneHour;
    public static readonly ThirteenHours = 13 * TimeSpansInMilleSeconds.OneHour;
    public static readonly FourteenHours = 14 * TimeSpansInMilleSeconds.OneHour;
    public static readonly FiveteenHours = 15 * TimeSpansInMilleSeconds.OneHour;
    public static readonly SixteenHours = 16 * TimeSpansInMilleSeconds.OneHour;
    public static readonly SeventeenHours = 17 * TimeSpansInMilleSeconds.OneHour;
    public static readonly EightteenHours = 18 * TimeSpansInMilleSeconds.OneHour;
    public static readonly NineteenHours = 19 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwentyHours = 20 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwentyoneHours = 21 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwentytwoHours = 22 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwentythreeHours = 23 * TimeSpansInMilleSeconds.OneHour;
    // Days
    public static readonly OneDay = 24 * TimeSpansInMilleSeconds.OneHour;
    public static readonly TwoDays = 2 * TimeSpansInMilleSeconds.OneDay;
    public static readonly ThreeDays = 3 * TimeSpansInMilleSeconds.OneDay;
    public static readonly FourDays = 4 * TimeSpansInMilleSeconds.OneDay;
    public static readonly FiveDays = 5 * TimeSpansInMilleSeconds.OneDay;
    public static readonly SixDays = 6 * TimeSpansInMilleSeconds.OneDay;
    // Week
    public static readonly OneWeek = 7 * TimeSpansInMilleSeconds.OneDay;
    public static readonly TwoWeeks = 2 * TimeSpansInMilleSeconds.OneWeek;
    public static readonly ThreeWeeks = 3 * TimeSpansInMilleSeconds.OneWeek;
    // Month
    public static readonly OneMonth = 4 * TimeSpansInMilleSeconds.OneWeek;
    public static readonly TwoMonths = 2 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly ThreeMonths = 3 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly FourMonths = 4 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly FiveMonths = 5 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly SixMonths = 6 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly SevenMonths = 7 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly EightMonths = 8 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly NineMonths = 9 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly TenMonths = 10 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly ElevenMonths = 11 * TimeSpansInMilleSeconds.OneMonth;
    // Year
    public static readonly OneYear = 12 * TimeSpansInMilleSeconds.OneMonth;
    public static readonly TwoYears = 2 * TimeSpansInMilleSeconds.OneYear;
    public static readonly ThreeYears = 3 * TimeSpansInMilleSeconds.OneYear;
    public static readonly FourYears = 4 * TimeSpansInMilleSeconds.OneYear;
    public static readonly FiveYears = 5 * TimeSpansInMilleSeconds.OneYear;
    public static readonly SixYears = 6 * TimeSpansInMilleSeconds.OneYear;
    public static readonly SevenYears = 7 * TimeSpansInMilleSeconds.OneYear;
    public static readonly EightYears = 8 * TimeSpansInMilleSeconds.OneYear;
    public static readonly NineYears = 9 * TimeSpansInMilleSeconds.OneYear;
    public static readonly TenYears = 10 * TimeSpansInMilleSeconds.OneYear;
    public static readonly ElevenYears = 11 * TimeSpansInMilleSeconds.OneYear;
    // Decade
    public static readonly OneDecade = 12 * TimeSpansInMilleSeconds.OneYear;
}
