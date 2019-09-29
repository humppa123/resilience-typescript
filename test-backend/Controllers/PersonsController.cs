using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using test_backend.Models;

namespace test_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonsController : ControllerBase
    {
        private static readonly IList<Person> TestData = new List<Person>
        {
            new Person{ Id = 1, FirstName = "John", LastName = "Thaw" },
            new Person{ Id = 2, FirstName = "Kevin", LastName = "Whately" },
            new Person{ Id = 3, FirstName = "James", LastName = "Grout" },
            new Person{ Id = 4, FirstName = "Peter", LastName = "Woodthorpe" },
            new Person{ Id = 5, FirstName = "Clare", LastName = "Holman" }
        };

        private readonly ILogger<PersonsController> _logger;

        public PersonsController(ILogger<PersonsController> logger)
        {
            this._logger = logger;
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var person = PersonsController.TestData.FirstOrDefault(p => p.Id == id);
            if (person == null)
            {
                return this.NotFound();
            }

            PersonsController.TestData.Remove(person);
            return this.NoContent();
        }

        [HttpGet]
        public IEnumerable<Person> Get()
        {
            return PersonsController.TestData;
        }

        [HttpGet("{id}")]
        public ActionResult<Person> Get(int id)
        {
            var person = PersonsController.TestData.FirstOrDefault(p => p.Id == id);
            if (person != null)
            {
                return person;
            }

            return this.NotFound();
        }

        [HttpPost]
        public ActionResult<Person> Post([FromBody] Person body)
        {
            if (!this.TryValidateModel(body))
            {
                return this.BadRequest();
            }

            body.Id = PersonsController.TestData.Max(p => p.Id) + 1;
            PersonsController.TestData.Add(body);

            return this.CreatedAtAction(nameof(Person), new { id = body.Id }, body);
        }

        [HttpPut("{id}")]
        public ActionResult<Person> Put(long id, [FromBody] Person body)
        {
            if (!this.TryValidateModel(body))
            {
                return this.BadRequest();
            }

            if (id != body.Id)
            {
                return this.BadRequest();
            }

            var person = PersonsController.TestData.FirstOrDefault(p => p.Id == id);
            if (person == null)
            {
                return this.NotFound();
            }

            person.FirstName = body.FirstName;
            person.LastName = body.LastName;

            return this.NoContent();
        }
    }
}