import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False
    
    # We want to replace "MARK 2 Technologies" with "MARK 2"
    if "MARK 2 Technologies" in content:
        new_content = content.replace("MARK 2 Technologies", "MARK 2")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
        return True
    return False

def main():
    root_dir = r"d:\self project\kes-denge"
    exclude_dirs = {".git", "node_modules", ".next", ".gemini", "appDataDir"}
    
    count = 0
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude directories
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        
        for filename in filenames:
            # Only process specific file extensions
            if not filename.endswith(('.ts', '.tsx', '.md', '.json', '.txt', '.css')):
                continue
                
            filepath = os.path.join(dirpath, filename)
            if replace_in_file(filepath):
                count += 1
                
    print(f"\nReplacement complete. Updated {count} files.")

if __name__ == "__main__":
    main()
