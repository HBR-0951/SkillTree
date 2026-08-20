using Microsoft.AspNetCore.Mvc;
using SkillTreeAPI.Core.Models;
using SkillTreeAPI.Data;

namespace SkillTreeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    [HttpGet]
    public IEnumerable<Skill> GetSkills()
    {
        return SkillSeedData.All;
    }
}
