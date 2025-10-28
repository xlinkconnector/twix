#!/usr/bin/env python3
"""
Generate favicon files in multiple sizes from the SVG logo.
Requires: Pillow, cairosvg
Install: pip install Pillow cairosvg
"""

import os
from pathlib import Path

try:
    from PIL import Image
    import cairosvg
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False
    print("⚠️  Dependencies not available. Install with:")
    print("   pip install Pillow cairosvg")

def generate_favicons():
    """Generate favicon files in multiple sizes."""
    
    if not DEPENDENCIES_AVAILABLE:
        print("\n📝 Manual favicon generation required:")
        print("   1. Use an online tool like https://realfavicongenerator.net/")
        print("   2. Upload images/logos/favicon.svg")
        print("   3. Download the generated package")
        print("   4. Extract to images/logos/ directory")
        return
    
    # Paths
    svg_path = Path("images/logos/favicon.svg")
    output_dir = Path("images/logos")
    
    if not svg_path.exists():
        print(f"❌ SVG file not found: {svg_path}")
        return
    
    # Sizes to generate
    sizes = [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (64, "favicon-64x64.png"),
        (180, "apple-touch-icon.png"),
        (192, "android-chrome-192x192.png"),
        (512, "android-chrome-512x512.png"),
    ]
    
    print("🎨 Generating favicon files...")
    
    for size, filename in sizes:
        output_path = output_dir / filename
        
        try:
            # Convert SVG to PNG at specified size
            png_data = cairosvg.svg2png(
                url=str(svg_path),
                output_width=size,
                output_height=size
            )
            
            # Save PNG
            with open(output_path, 'wb') as f:
                f.write(png_data)
            
            print(f"   ✓ Generated {filename} ({size}x{size})")
            
        except Exception as e:
            print(f"   ❌ Failed to generate {filename}: {e}")
    
    # Generate ICO file (16x16, 32x32, 64x64)
    try:
        ico_path = output_dir / "favicon.ico"
        images = []
        
        for size in [16, 32, 64]:
            png_path = output_dir / f"favicon-{size}x{size}.png"
            if png_path.exists():
                img = Image.open(png_path)
                images.append(img)
        
        if images:
            images[0].save(
                ico_path,
                format='ICO',
                sizes=[(img.width, img.height) for img in images]
            )
            print(f"   ✓ Generated favicon.ico")
        
    except Exception as e:
        print(f"   ❌ Failed to generate favicon.ico: {e}")
    
    print("\n✅ Favicon generation complete!")
    print(f"   Files saved to: {output_dir}")

def create_manifest():
    """Create site.webmanifest for PWA support."""
    
    manifest = {
        "name": "TWIX Chain",
        "short_name": "TWIX",
        "description": "Blockchain secured by Proof of Symbiosis",
        "icons": [
            {
                "src": "/images/logos/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/images/logos/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "theme_color": "#0A0E27",
        "background_color": "#0A0E27",
        "display": "standalone",
        "start_url": "/"
    }
    
    import json
    manifest_path = Path("site.webmanifest")
    
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"✅ Created {manifest_path}")

if __name__ == "__main__":
    print("🚀 TWIX Chain Favicon Generator\n")
    generate_favicons()
    print()
    create_manifest()
    print("\n📋 Next steps:")
    print("   1. Verify favicon files in images/logos/")
    print("   2. Test favicons in browser")
    print("   3. Use https://realfavicongenerator.net/ to validate")