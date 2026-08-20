namespace SkillTreeAPI.Core.Models;

public class Pending
{
    public Pending(int prNumber, string prUrl)
    {
        PrNumber = prNumber;
        PrUrl = prUrl;
    }

    public int PrNumber { get; }
    public string PrUrl { get; }
}