"""Generate a terminology-protected English draft with a local NLLB model.

Usage:
  python scripts/generate-english-localization.py SOURCE_JSON MODEL_DIR OUTPUT_JS
  python scripts/generate-english-localization.py SOURCE_JSON online OUTPUT_JS

This is an authoring tool, not a website dependency. The model is stored outside
the repository. Official names and project terminology are protected before
translation; the output still requires the repository audits and human review.
"""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


EXACT_TRANSLATIONS = {
    "正传": "Mainline",
    "外传": "Spin-off",
    "重制": "Remake",
    "强化版": "Enhanced Edition",
    "重构": "Reimagining",
    "续作": "Sequel",
    "前传": "Prequel",
    "同人游戏": "Fan Game",
    "ROM 改版": "ROM Hack",
    "回合制 RPG": "Turn-based RPG",
    "动作 RPG": "Action RPG",
    "战略 RPG": "Tactical RPG",
    "战棋": "Tactical RPG",
    "家用机": "Home Console",
    "掌机": "Handheld",
    "混合机": "Hybrid",
    "混合 / PC 掌机": "Hybrid / Handheld PC",
    "御三家": "Starter Trio",
    "首次登陆": "First Release",
    "后续登陆": "Later Releases",
    "产品线": "Product Line",
    "硬件型号": "Hardware Model",
    "待补": "To Be Confirmed",
    "暂未整理。": "Not documented yet.",
    "暂未整理型号。": "No models documented yet.",
}

TERM_REPLACEMENTS = [
    ("《AI：梦境档案 涅槃肇始》", "AI: The Somnium Files – nirvanA Initiative"),
    ("《AI：梦境档案》", "AI: The Somnium Files"),
    ("《428：被封锁的涩谷》", "428: Shibuya Scramble"),
    ("《街：命运的交叉点》", "Machi: Unmei no Kōsaten"),
    ("《港口镇连续杀人事件》", "The Portopia Serial Murder Case"),
    ("《终天教团》", "SHUTEN ORDER"),
    ("《风来的西林》", "Shiren the Wanderer"),
    ("《侍道》", "Way of the Samurai"),
    ("《超级侦探事件簿 雾雨谜宫》", "Master Detective Archives: RAIN CODE"),
    ("《宝可梦传说 阿尔宙斯》", "Pokémon Legends: Arceus"),
    ("《宝可梦传说 Z-A》", "Pokémon Legends: Z-A"),
    ("《宝可梦不可思议的迷宫》", "Pokémon Mystery Dungeon"),
    ("《最终幻想战略版》", "Final Fantasy Tactics"),
    ("《最终幻想》", "Final Fantasy"),
    ("《勇者斗恶龙》", "Dragon Quest"),
    ("《恐怖惊魂夜》", "Kamaitachi no Yoru"),
    ("《弟切草》", "Otogirisō"),
    ("《弹丸论破》", "Danganronpa"),
    ("《极限脱出》", "Zero Escape"),
    ("《异度神剑》", "Xenoblade"),
    ("《异度装甲》", "Xenogears"),
    ("《异度传说》", "Xenosaga"),
    ("《如龙》", "Like a Dragon"),
    ("宝可梦传说", "Pokémon Legends"),
    ("宝可梦不可思议的迷宫", "Pokémon Mystery Dungeon"),
    ("最终幻想战略版", "Final Fantasy Tactics"),
    ("最终幻想", "Final Fantasy"),
    ("勇者斗恶龙", "Dragon Quest"),
    ("Spike Chunsoft 叙事游戏设计谱系", "Spike Chunsoft narrative-game design lineage"),
    ("超级侦探事件簿", "Master Detective Archives"),
    ("AI：梦境档案", "AI: The Somnium Files"),
    ("428：被封锁的涩谷", "428: Shibuya Scramble"),
    ("街：命运的交叉点", "Machi: Unmei no Kōsaten"),
    ("港口镇连续杀人事件", "The Portopia Serial Murder Case"),
    ("终天教团", "SHUTEN ORDER"),
    ("风来的西林", "Shiren the Wanderer"),
    ("侍道", "Way of the Samurai"),
    ("恐怖惊魂夜", "Kamaitachi no Yoru"),
    ("弟切草", "Otogirisō"),
    ("弹丸论破", "Danganronpa"),
    ("极限脱出", "Zero Escape"),
    ("异度神剑", "Xenoblade"),
    ("异度之刃", "Xenoblade"),
    ("异度装甲", "Xenogears"),
    ("异度传说", "Xenosaga"),
    ("如龙", "Like a Dragon"),
    ("宝可梦", "Pokémon"),
    ("口袋妖怪", "Pokémon"),
    ("小高和刚", "Kazutaka Kodaka"),
    ("打越钢太郎", "Kotaro Uchikoshi"),
    ("桐生一马", "Kazuma Kiryu"),
    ("桐生", "Kiryu"),
    ("春日一番", "Ichiban Kasuga"),
    ("春日", "Ichiban"),
    ("八神隆之", "Takayuki Yagami"),
    ("八神", "Yagami"),
    ("真岛吾朗", "Goro Majima"),
    ("真岛", "Majima"),
    ("峰义孝", "Yoshitaka Mine"),
    ("神室町", "Kamurocho"),
    ("苍天堀", "Sotenbori"),
    ("伊达键", "Kaname Date"),
    ("伊达主导", "led by Date"),
    ("伊达", "Date"),
    ("学级裁判", "Class Trial"),
    ("言弹", "Truth Bullet"),
    ("“极”路线", "the Kiwami line"),
    ("《极》系列", "the Kiwami remakes"),
    ("《极 3》", "Yakuza Kiwami 3"),
    ("《维新！极》", "Like a Dragon: Ishin!"),
    ("《维新》", "Ryū ga Gotoku Ishin!"),
    ("《AI》正传", "the AI: The Somnium Files mainline titles"),
    ("伊达主导的中篇", "a mid-length story led by Date"),
    ("擦肩通信", "StreetPass"),
    ("擦肩交换", "StreetPass exchange"),
    ("可随身共游", "portable local co-op"),
    ("藏宝图", "treasure maps"),
    ("不可思议迷宫", "Mystery Dungeon"),
    ("不思议迷宫", "Mystery Dungeon"),
    ("水晶编年史", "Crystal Chronicles"),
    ("怪兽战斗之路", "Monster Battle Road"),
    ("达伊大冒险", "The Adventure of Dai"),
    ("创世小玩家", "Builders"),
    ("怪兽篇", "Monsters"),
    ("史莱姆", "Slime"),
    ("陆行鸟", "Chocobo"),
    ("魔晶石", "Materia"),
    ("塞西尔", "Cecil"),
    ("巴隆", "Baron"),
    ("戈尔贝札", "Golbez"),
    ("泽姆斯", "Zemus"),
    ("巴兹", "Bartz"),
    ("蕾娜", "Lenna"),
    ("加拉夫", "Galuf"),
    ("法莉斯", "Faris"),
    ("艾克斯德", "Exdeath"),
    ("蒂娜", "Terra"),
    ("洛克", "Locke"),
    ("凯夫卡", "Kefka"),
    ("克劳德", "Cloud"),
    ("萨菲罗斯", "Sephiroth"),
    ("斯考尔", "Squall"),
    ("莉诺雅", "Rinoa"),
    ("吉坦", "Zidane"),
    ("嘉妮特", "Garnet"),
    ("泰达", "Tidus"),
    ("尤娜", "Yuna"),
    ("梵", "Vaan"),
    ("阿雪", "Ashe"),
    ("雷光", "Lightning"),
    ("诺克提斯", "Noctis"),
    ("克莱夫", "Clive"),
    ("主动时间战斗", "Active Time Battle"),
    ("即时战斗量表", "Active Time Battle gauge"),
    ("ATB 量表", "ATB gauge"),
    ("召唤兽", "summon"),
    ("职业系统", "job system"),
    ("转职", "job change"),
    ("职业", "job"),
    ("咒文", "spells"),
    ("图鉴", "Pokédex"),
    ("道馆", "Gym"),
    ("四天王", "Elite Four"),
    ("特性", "Ability"),
    ("性格", "Nature"),
    ("招式", "move"),
    ("属性克制", "type matchups"),
    ("属性", "type"),
    ("超级进化", "Mega Evolution"),
    ("极巨化", "Dynamax"),
    ("太晶化", "Terastallization"),
    ("Z 招式", "Z-Moves"),
    ("御三家", "starter trio"),
    ("异刃", "Blade"),
    ("神剑", "Monado"),
    ("牵绊", "Affinity"),
    ("连锁攻击", "Chain Attack"),
    ("未来视", "Vision"),
    ("灵魂之声", "Soul Voice"),
    ("音游", "rhythm game"),
    ("角色外传", "character-focused spin-off"),
    ("Escape 段落", "escape-room segment"),
    ("中篇", "mid-length story"),
    ("开放世界", "open world"),
    ("世界观", "setting"),
    ("正史", "canon"),
    ("群像", "ensemble cast"),
    ("主循环", "core loop"),
    ("支线", "side content"),
    ("玩法", "gameplay"),
    ("机制", "mechanics"),
    ("编队", "party building"),
    ("养成", "progression"),
    ("局外", "metagame"),
    ("短局", "short sessions"),
    ("移植", "port"),
    ("复刻", "re-release"),
    ("后续登陆", "later releases"),
    ("首次登陆", "first release"),
    ("正式公开发售日", "official release date"),
    ("公开发售日", "public release date"),
    ("发售日", "release date"),
    ("战棋", "tactical RPG"),
    ("回合制", "turn-based"),
    ("即时动作", "real-time action"),
    ("大逃杀", "battle royale"),
    ("卡牌", "cards"),
    ("抽取", "gacha"),
    ("刷取", "grind for rewards"),
    ("通关", "complete the main story"),
    ("正传", "mainline game"),
    ("外传", "spin-off"),
    ("重制", "remake"),
    ("强化版", "enhanced edition"),
    ("续作", "sequel"),
    ("前传", "prequel"),
    ("主机", "console"),
    ("掌机", "handheld"),
]


def split_text(text: str, maximum: int = 160) -> list[str]:
    segments: list[str] = []
    for paragraph_index, paragraph in enumerate(text.split("\n")):
        if paragraph_index:
            segments.append("\n")
        if not paragraph:
            continue
        clauses = re.split(r"(?<=[。！？；])", paragraph)
        current = ""
        for clause in clauses:
            if len(current) + len(clause) <= maximum:
                current += clause
                continue
            if current:
                segments.append(current)
            while len(clause) > maximum:
                candidates = [clause.rfind(mark, 0, maximum) for mark in "，、：,;:"]
                split_at = max(candidates)
                split_at = maximum if split_at < maximum // 3 else split_at + 1
                segments.append(clause[:split_at])
                clause = clause[split_at:]
            current = clause
        if current:
            segments.append(current)
    return segments


def prepare(text: str) -> str:
    result = text
    for source, target in sorted(TERM_REPLACEMENTS, key=lambda pair: len(pair[0]), reverse=True):
        result = result.replace(source, f" {target} ")
    return re.sub(r" {2,}", " ", result).strip()


def clean_translation(text: str) -> str:
    text = text.strip()
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"([([{])\s+", r"\1", text)
    text = re.sub(r"\s+([)\]}])", r"\1", text)
    text = re.sub(r"([.;!?])(?=[A-Z])", r"\1 ", text)
    text = re.sub(r" {2,}", " ", text)
    return text


def microsoft_token() -> str:
    request = urllib.request.Request(
        "https://edge.microsoft.com/translate/auth",
        headers={"User-Agent": "GameArchiveLocalization/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def translate_online_batch(batch: list[str], token: str) -> list[str]:
    payload = json.dumps([{"Text": text} for text in batch], ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        "https://api-edge.cognitive.microsofttranslator.com/translate"
        "?api-version=3.0&from=zh-Hans&to=en",
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json; charset=UTF-8",
            "User-Agent": "GameArchiveLocalization/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        result = json.loads(response.read().decode("utf-8"))
    return [clean_translation(item["translations"][0]["text"]) for item in result]


def generate_online(pending: list[str], cache: dict[str, str], cache_path: Path) -> None:
    token = microsoft_token()
    batch_size = 80
    for start in range(0, len(pending), batch_size):
        batch = pending[start : start + batch_size]
        for attempt in range(3):
            try:
                translated = translate_online_batch(batch, token)
                break
            except urllib.error.HTTPError as error:
                if error.code == 401:
                    token = microsoft_token()
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)
            except urllib.error.URLError:
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)
        for source, result in zip(batch, translated):
            cache[source] = result
        if start % (batch_size * 4) == 0:
            cache_path.write_text(
                json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        print(f"  {min(start + batch_size, len(pending))}/{len(pending)}", flush=True)
        time.sleep(0.4)


def generate_local(pending: list[str], cache: dict[str, str], cache_path: Path, model_dir: str) -> None:
    import ctranslate2
    from transformers import AutoTokenizer

    tokenizer = AutoTokenizer.from_pretrained(
        model_dir,
        local_files_only=True,
        src_lang="zho_Hans",
        use_fast=False,
    )
    translator = ctranslate2.Translator(
        model_dir,
        device="cpu",
        compute_type="int8",
        inter_threads=1,
        intra_threads=8,
    )
    batch_size = 64
    for start in range(0, len(pending), batch_size):
        batch = pending[start : start + batch_size]
        source_tokens = [
            tokenizer.convert_ids_to_tokens(tokenizer.encode(text))
            for text in batch
        ]
        results = translator.translate_batch(
            source_tokens,
            target_prefix=[["eng_Latn"]] * len(batch),
            beam_size=1,
            max_batch_size=2048,
            batch_type="tokens",
            max_decoding_length=384,
        )
        translated = [
            tokenizer.decode(
                tokenizer.convert_tokens_to_ids(result.hypotheses[0][1:]),
                skip_special_tokens=True,
            )
            for result in results
        ]
        for source, result in zip(batch, translated):
            cache[source] = clean_translation(result)
        if start % (batch_size * 4) == 0:
            cache_path.write_text(
                json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"  {min(start + batch_size, len(pending))}/{len(pending)}", flush=True)


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Expected SOURCE_JSON MODEL_DIR OUTPUT_JS")

    source_path = Path(sys.argv[1])
    engine = sys.argv[2]
    output_path = Path(sys.argv[3])
    cache_name = "game-archive-ms-translation-cache.json" if engine == "online" else "game-archive-nllb-translation-cache.json"
    cache_path = source_path.with_name(cache_name)
    source_entries = json.loads(source_path.read_text(encoding="utf-8"))
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}

    pending: list[str] = []
    for entry in source_entries:
        source = entry["source"]
        if source in EXACT_TRANSLATIONS:
            continue
        pending.extend(
            segment for segment in split_text(prepare(source))
            if segment != "\n" and segment not in cache
        )

    pending = list(dict.fromkeys(pending))
    print(f"Translating {len(pending)} terminology-protected segments...")
    if engine == "online":
        generate_online(pending, cache, cache_path)
    else:
        generate_local(pending, cache, cache_path, engine)

    cache_path.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    translations: dict[str, str] = {}
    for entry in source_entries:
        source = entry["source"]
        if source in EXACT_TRANSLATIONS:
            translations[source] = EXACT_TRANSLATIONS[source]
            continue
        translated_parts = [
            "\n" if segment == "\n" else cache[segment]
            for segment in split_text(prepare(source))
        ]
        translations[source] = clean_translation("".join(translated_parts).strip())

    output = "window.ENGLISH_TRANSLATIONS = " + json.dumps(
        translations,
        ensure_ascii=False,
        indent=2,
    ) + ";\n"
    output_path.write_text(output, encoding="utf-8")
    print(f"Wrote {len(translations)} translations to {output_path}")


if __name__ == "__main__":
    main()
