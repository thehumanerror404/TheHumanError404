import zipfile
import re
import sys
import os

def get_docx_text(path):
    document = zipfile.ZipFile(path)
    xml_content = document.read('word/document.xml')
    document.close()
    
    # Very basic XML parsing to extract text
    # Remove XML tags
    content = xml_content.decode('utf-8')
    text = re.sub('<[^<]+?>', '', content)
    return text

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <filename>")
        sys.exit(1)
        
    filename = sys.argv[1]
    try:
        text = get_docx_text(filename)
        print(text)
    except Exception as e:
        print(f"Error: {e}")
