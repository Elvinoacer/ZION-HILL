import json
import os

INPUT_FILE = 'api_analysis.json'
OUTPUT_FILE = 'API_DOCUMENTATION.md'

def generate_description(path):
    # simple heuristic to generate a readable name
    parts = path.strip('/').split('/')
    if parts[0] == 'api':
        parts = parts[1:]
    
    # Capitalize and join
    name = ' '.join(p.capitalize() for p in parts)
    
    # Handle dynamic segments like [id]
    name = name.replace('[', '{').replace(']', '}')
    
    return f"Manage {name}"

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found")
        return

    with open(INPUT_FILE, 'r') as f:
        routes = json.load(f)

    with open(OUTPUT_FILE, 'w') as f:
        f.write("# API Documentation\n\n")
        f.write("This document lists all the API endpoints found in the project `src/app/api` directory.\n\n")
        
        f.write(f"**Total Endpoints:** {len(routes)}\n\n")
        
        f.write("| Endpoint | Methods | Description |\n")
        f.write("| :--- | :--- | :--- |\n")
        
        for route in routes:
            path = route['path']
            methods = ', '.join(sorted(route['methods']))
            description = generate_description(path)
            
            # Escape pipes in description just in case
            description = description.replace('|', '\|')
            
            f.write(f"| `{path}` | **{methods}** | {description} |\n")
            
    print(f"Documentation generated at {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
