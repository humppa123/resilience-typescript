namespace test_backend.Models
{
    using System.ComponentModel.DataAnnotations;

    public sealed class Person
    {
        [Required]
        public string FirstName { get; set; }

        public int? Id { get; set; }

        [Required]
        public string LastName { get; set; }
    }
}