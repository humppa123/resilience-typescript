using System.ComponentModel.DataAnnotations;

namespace test_backend.Models
{
    public class Person
    {
        [Required]
        public string FirstName { get; set; }

        public int? Id { get; set; }

        [Required]
        public string LastName { get; set; }
    }
}