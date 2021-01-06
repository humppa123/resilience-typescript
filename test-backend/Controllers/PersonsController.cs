namespace test_backend.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Models;

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("api/[controller]")]
    public sealed class PersonsController : ControllerBase
    {
        private static readonly IList<Person> TestData = new List<Person>
        {
            new Person{ Id = 1, FirstName = "John", LastName = "Thaw" },
            new Person{ Id = 2, FirstName = "Kevin", LastName = "Whately" },
            new Person{ Id = 3, FirstName = "James", LastName = "Grout" },
            new Person{ Id = 4, FirstName = "Peter", LastName = "Woodthorpe" },
            new Person{ Id = 5, FirstName = "Clare", LastName = "Holman" }
        };

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            PersonsController.FailRandomly();

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
            PersonsController.FailRandomly();

            return PersonsController.TestData;
        }

        [HttpGet("{id}")]
        public ActionResult<Person> Get(int id)
        {
            PersonsController.FailRandomly();

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
            PersonsController.FailRandomly();

            if (body == null)
            {
                return this.BadRequest();
            }

            if (!this.TryValidateModel(body))
            {
                return this.BadRequest();
            }

            body.Id = PersonsController.TestData.Max(p => p.Id) + 1;
            PersonsController.TestData.Add(body);

            return this.CreatedAtAction("Get", new { id = body.Id }, body);
        }

        [HttpPut("{id}")]
        public ActionResult<Person> Put(long id, [FromBody] Person body)
        {
            PersonsController.FailRandomly();

            if (body == null)
            {
                return this.BadRequest();
            }

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

        private static void FailRandomly()
        {
            if (DateTime.Now.Second % 2 == 0)
            {
                throw new ExpectedException();
            }
        }
    }
}