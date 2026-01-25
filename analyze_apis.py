import os
import re
import json

ROOT_DIR = '/home/elvin/Projects/businesses/church-web-v2/src/app/api'
OUTPUT_FILE = 'api_analysis.json'

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    methods = []
    # Regex to find exported async functions for HTTP methods
    # Matches: export async function GET(request: Request) ...
    matches = re.finditer(r'export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(', content)
    
    for match in matches:
        methods.append(match.group(1))
    
    return methods

def main():
    api_routes = []
    
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file in ['route.ts', 'route.js']:
                full_path = os.path.join(root, file)
                # content analysis
                methods = analyze_file(full_path)
                
                if methods:
                    # Calculate relative route path
                    # /home/.../src/app/api/auth/[...nextauth]/route.ts -> /api/auth/[...nextauth]
                    rel_path = os.path.relpath(root, '/home/elvin/Projects/businesses/church-web-v2/src/app')
                    route_path = '/' + rel_path
                    
                    api_routes.append({
                        'path': route_path,
                        'file': full_path,
                        'methods': methods
                    })

    # Sort by path
    api_routes.sort(key=lambda x: x['path'])
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(api_routes, f, indent=2)
    print(f"Analysis saved to {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
