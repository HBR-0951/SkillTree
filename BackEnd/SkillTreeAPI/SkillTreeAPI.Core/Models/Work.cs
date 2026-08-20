using System.Text.Json.Serialization;

namespace SkillTreeAPI.Core.Models;

public class Work
{
    public Work(string title, string description, Kind kind, string stack, string url)
    {
        Title = title;
        Description = description;
        Kind = kind;
        Stack = stack;
        Url = url;
    }

    public string Title { get; }

    [JsonPropertyName("desc")]
    public string Description { get; }
    public Kind Kind { get; }
    public string Stack { get; }
    public string Url { get; }
}