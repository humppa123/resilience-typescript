namespace test_backend.Models
{
    using System;

    public sealed class ExpectedException : Exception
    {
        public ExpectedException()
        {
        }

        public ExpectedException(string message) : base(message)
        {
        }

        public ExpectedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}