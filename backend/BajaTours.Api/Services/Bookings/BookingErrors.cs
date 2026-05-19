namespace BajaTours.Api.Services.Bookings;

public enum BookingError
{
    None = 0,
    TourNotFound,
    TourNotBookable,
    InvalidGuestCount,
    BookingNotFound,
    NotAuthorized,
    NotCancellable,
    RefundFailed
}

public class BookingException : Exception
{
    public BookingError Error { get; }
    public BookingException(BookingError error, string message) : base(message) => Error = error;
}
