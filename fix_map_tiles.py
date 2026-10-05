import os

def replace_tiles(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()

    # The exact CartoDB block
    carto_tile = '''<TileLayer
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />'''
    carto_tile2 = '''<TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />'''
              
    osm_tile = '''<TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />'''

    content = content.replace(carto_tile, osm_tile)
    content = content.replace(carto_tile2, osm_tile)

    with open(filepath, 'w') as f:
        f.write(content)

replace_tiles('frontend/src/components/police/PoliceHeatmap.js')
replace_tiles('frontend/src/pages/dashboard/CrimeMapPage.js')

print("Tiles reverted to free OpenStreetMap.")
