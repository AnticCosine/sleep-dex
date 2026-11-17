import json
import re
import os

# --- CONFIGURATION ---
INPUT_FILENAME = "pokemon.json"
OUTPUT_FILENAME = "pokemon.json"    
ISLANDS = ["greengrass_isle", "cyan_beach","taupe_hollow","snowdrop_tundra","lapis_lakeside","old_gold_power_plant","amber_canyon","greengrass_isle_expert","cyan_beach_expert"]
CURRENT_ISLAND = ISLANDS[8]  # <--- Set your target island here

# Your pasted raw text
PASTED_TEXT = """



"""

def normalize_name(name):
    """Standardizes names to match JSON IDs."""
    name = name.lower().strip()

    if "(alolan form)" in name:
        name = "alolan_" + name.replace("(alolan form)", "").strip()
        #print(name)
    elif "(paldean form)" in name:
        name = "paldean_" + name.replace("(paldean form)", "").strip()
        #print(name)

    if "(holiday)" in name:
        name = name.replace("(holiday)", "").strip() + "_holiday"
        #print(name)
    elif "(halloween) (orange)" in name:
        print(name)
        name = name.replace("(halloween) (orange)", "").strip() + "_halloween"
        #print(name)
    
    for variety in ["jumbo", "medium", "small", "large"]:
        if f"({variety} variety)" in name:
            name = name.replace(f"({variety} variety)", "").strip() + f"_{variety}"
            #print(name)
            
    if "(amped form)" in name:
        name = name.replace("(amped form)", "").strip() + "_amped_form"
        #print(name)
    elif "(low key form)" in name:
        name = name.replace("(low key form)", "").strip() + "_low_key_form"
        #print(name)

    name = re.sub(r"[^a-z0-9_']", '_', name)
    
    return re.sub(r'_+', '_', name).strip('_')


def process_update():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, INPUT_FILENAME)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            pokemon_data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    # --- UPDATED REGEX LOGIC FOR NEW LAYOUT ---
    # 1. Capture Name: ([^\n]+)
    # 2. Capture Star count: (\d+)
    # 3. Match ID: #\d+
    # 4. Match Optional Line (like Global DP Reward): (?:\s+Global DP Reward)?
    # 5. Match SPO ID block: \s+SPO ID\s+\d+
    pattern = r"([^\n]+)\s+(\d+)\s+#\d+(?:\s+[^\n]+)*?\s+SPO ID\s+\d+"
    matches = re.findall(pattern, PASTED_TEXT)
    print(len(matches))

    updates = {}
    for raw_name, star_count in matches:
        #print(raw_name)
        norm_name = normalize_name(raw_name)
        star_key = f"{star_count}_star"
        
        if norm_name not in updates:
            updates[norm_name] = set()
        updates[norm_name].add(star_key)

    update_count = 0
    matched_names = set()

    #print("UPDATES:", updates)
    
    # --- UPDATE JSON DATA ---
    for pokemon in pokemon_data:
        poke_id = pokemon.get("id", "").lower()
        
        if poke_id in updates:
            matched_names.add(poke_id)
            
            if "availability" not in pokemon:
                pokemon["availability"] = {}
            
            for star_key in updates[poke_id]:
                if star_key not in pokemon["availability"]:
                    pokemon["availability"][star_key] = []
                
                if CURRENT_ISLAND not in pokemon["availability"][star_key]:
                    pokemon["availability"][star_key].append(CURRENT_ISLAND)
                    update_count += 1

            sorted_availability = {
            key: pokemon["availability"][key]
            for key in sorted(
                pokemon["availability"].keys(),
                key=lambda x: int(x.split("_")[0])
            )
            }
            # Replace with the newly ordered dict
            pokemon["availability"] = sorted_availability

    unmatched = sorted(set(updates.keys()) - matched_names)

    if unmatched:
        print("\n⚠️ Pokémon not found in pokemon.json:")
        for name in unmatched:
            stars = ", ".join(sorted(updates[name]))
            print(f"  - {name} ({stars})")
    else:
        print("\n✓ All Pokémon matched successfully.")

    output_path = os.path.join(script_dir, OUTPUT_FILENAME)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pokemon_data, f, indent=2)

    print(f"\nSuccess! Updated {update_count} entries for {len(matched_names)} Pokémon on '{CURRENT_ISLAND}'.")

if __name__ == "__main__":
    process_update()