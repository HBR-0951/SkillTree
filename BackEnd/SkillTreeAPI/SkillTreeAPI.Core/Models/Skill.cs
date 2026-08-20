using System.Text.Json.Serialization;
using SkillTreeAPI.Core.Enums;

namespace SkillTreeAPI.Core.Models;

public class Skill
{
    public Skill(
        string id,
        string slug,
        string name,
        Tier tier,
        string? parent,
        int number,
        int progress,
        string blurb,
        List<string> tags,
        Position? position,
        string notesDir,
        int noteCount,
        List<Work> works,
        Pending? pending)
    {
        Id = id;
        Slug = slug;
        Name = name;
        Tier = tier;
        Parent = parent;
        Number = number;
        Progress = progress;
        Blurb = blurb;
        Tags = tags;
        Position = position;
        NotesDir = notesDir;
        NoteCount = noteCount;
        Works = works;
        Pending = pending;
    }

    /// <summary>資料庫 primary key。未來接上真的 DB 後會是 long；FE 目前完全不參照這個欄位。</summary>
    public string Id { get; }

    /// <summary>人類可讀、建立後不變的識別碼。parent / URL / notesDir 等所有「參照」都用這個欄位。</summary>
    public string Slug { get; }
    public string Name { get; }
    public Tier Tier { get; }

    /// <summary>前置技能的 Slug；null 代表直接接在 root。</summary>
    public string? Parent { get; }

    [JsonPropertyName("level")]
    public int Number { get; }
    public int Progress { get; }
    public string Blurb { get; }
    public List<string> Tags { get; }
    public Position? Position { get; }
    public string NotesDir { get; }
    public int NoteCount { get; }
    public List<Work> Works { get; }
    public Pending? Pending { get; }
}