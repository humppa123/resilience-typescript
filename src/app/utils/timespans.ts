export class TimeSpansInMilliSeconds {
    // Min + max
    public static readonly MINIMUM = 0;
    public static readonly MAXIMUM = Number.MAX_SAFE_INTEGER;

    // Milli seconds
    public static readonly OneHundredMilliSeconds = 100;
    public static readonly TwoHundredMilliSeconds = 2 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly ThreeHundredMilliSeconds = 3 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly FourHundredMilliSeconds = 4 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly FiveHundredMilliSeconds = 5 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly SixHundredMilliSeconds = 6 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly SevenHundredMilliSeconds = 7 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly EightHundredMilliSeconds = 8 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly NineHundredMilliSeconds = 9 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    // Seconds
    public static readonly OneSecond = 10 * TimeSpansInMilliSeconds.OneHundredMilliSeconds;
    public static readonly TwoSeconds = 2 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly ThreeSeconds = 3 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly FourSeconds = 4 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly FiveSeconds = 5 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly SixSeconds = 6 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly SevenSeconds = 7 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly EightSeconds = 8 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly NineSeconds = 9 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly TenSeconds = 10 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly TwentySeconds = 20 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly ThirtySeconds = 30 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly FourtySeconds = 40 * TimeSpansInMilliSeconds.OneSecond;
    public static readonly FithtySeconds = 50 * TimeSpansInMilliSeconds.OneSecond;
    // Minutes
    public static readonly OneMinute = 60 + TimeSpansInMilliSeconds.OneSecond;
    public static readonly TwoMinutes = 2 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly ThreeMinutes = 3 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly FourMinutes = 4 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly FiveMinutes = 5 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly SixMinutes = 6 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly SevenMinutes = 7 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly EightMinutes = 8 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly NineMinutes = 9 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly TenMinutes = 10 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly TwentyMinutes = 20 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly ThirtyMinutes = 30 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly FourtyMinutes = 40 + TimeSpansInMilliSeconds.OneMinute;
    public static readonly FithtyMinutes = 50 + TimeSpansInMilliSeconds.OneMinute;
    // Hours
    public static readonly OneHour = 60 * TimeSpansInMilliSeconds.OneMinute;
    public static readonly TwoHours = 2 * TimeSpansInMilliSeconds.OneHour;
    public static readonly ThreeHours = 3 * TimeSpansInMilliSeconds.OneHour;
    public static readonly FourHours = 4 * TimeSpansInMilliSeconds.OneHour;
    public static readonly FiveHours = 5 * TimeSpansInMilliSeconds.OneHour;
    public static readonly SixHours = 6 * TimeSpansInMilliSeconds.OneHour;
    public static readonly SevenHours = 7 * TimeSpansInMilliSeconds.OneHour;
    public static readonly EightHours = 8 * TimeSpansInMilliSeconds.OneHour;
    public static readonly NineHours = 9 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TenHours = 10 * TimeSpansInMilliSeconds.OneHour;
    public static readonly ElevenHours = 11 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwelveHours = 12 * TimeSpansInMilliSeconds.OneHour;
    public static readonly ThirteenHours = 13 * TimeSpansInMilliSeconds.OneHour;
    public static readonly FourteenHours = 14 * TimeSpansInMilliSeconds.OneHour;
    public static readonly FiveteenHours = 15 * TimeSpansInMilliSeconds.OneHour;
    public static readonly SixteenHours = 16 * TimeSpansInMilliSeconds.OneHour;
    public static readonly SeventeenHours = 17 * TimeSpansInMilliSeconds.OneHour;
    public static readonly EightteenHours = 18 * TimeSpansInMilliSeconds.OneHour;
    public static readonly NineteenHours = 19 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwentyHours = 20 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwentyoneHours = 21 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwentytwoHours = 22 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwentythreeHours = 23 * TimeSpansInMilliSeconds.OneHour;
    // Days
    public static readonly OneDay = 24 * TimeSpansInMilliSeconds.OneHour;
    public static readonly TwoDays = 2 * TimeSpansInMilliSeconds.OneDay;
    public static readonly ThreeDays = 3 * TimeSpansInMilliSeconds.OneDay;
    public static readonly FourDays = 4 * TimeSpansInMilliSeconds.OneDay;
    public static readonly FiveDays = 5 * TimeSpansInMilliSeconds.OneDay;
    public static readonly SixDays = 6 * TimeSpansInMilliSeconds.OneDay;
    // Week
    public static readonly OneWeek = 7 * TimeSpansInMilliSeconds.OneDay;
    public static readonly TwoWeeks = 2 * TimeSpansInMilliSeconds.OneWeek;
    public static readonly ThreeWeeks = 3 * TimeSpansInMilliSeconds.OneWeek;
    // Month
    public static readonly OneMonth = 4 * TimeSpansInMilliSeconds.OneWeek;
    public static readonly TwoMonths = 2 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly ThreeMonths = 3 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly FourMonths = 4 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly FiveMonths = 5 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly SixMonths = 6 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly SevenMonths = 7 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly EightMonths = 8 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly NineMonths = 9 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly TenMonths = 10 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly ElevenMonths = 11 * TimeSpansInMilliSeconds.OneMonth;
    // Year
    public static readonly OneYear = 12 * TimeSpansInMilliSeconds.OneMonth;
    public static readonly TwoYears = 2 * TimeSpansInMilliSeconds.OneYear;
    public static readonly ThreeYears = 3 * TimeSpansInMilliSeconds.OneYear;
    public static readonly FourYears = 4 * TimeSpansInMilliSeconds.OneYear;
    public static readonly FiveYears = 5 * TimeSpansInMilliSeconds.OneYear;
    public static readonly SixYears = 6 * TimeSpansInMilliSeconds.OneYear;
    public static readonly SevenYears = 7 * TimeSpansInMilliSeconds.OneYear;
    public static readonly EightYears = 8 * TimeSpansInMilliSeconds.OneYear;
    public static readonly NineYears = 9 * TimeSpansInMilliSeconds.OneYear;
    public static readonly TenYears = 10 * TimeSpansInMilliSeconds.OneYear;
    public static readonly ElevenYears = 11 * TimeSpansInMilliSeconds.OneYear;
    // Decade
    public static readonly OneDecade = 12 * TimeSpansInMilliSeconds.OneYear;
}
