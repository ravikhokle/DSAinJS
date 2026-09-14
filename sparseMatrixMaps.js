/**
 * SPARSE MATRIX APPLICATION: MAPS AND NAVIGATION
 * 
 * In map systems, sparse matrices are crucial because:
 * - Most locations are NOT directly connected to most other locations
 * - Only actual roads/paths need to be stored
 * - Enables efficient pathfinding (Dijkstra, A*, etc.)
 * - Used in Google Maps, GPS navigation, routing systems
 */

class SparseMatrixMap {
    constructor(numLocations) {
        this.numLocations = numLocations;
        // Sparse representation: only store existing roads
        this.roads = new Map(); // key: "from,to", value: {distance, roadType}
        this.locations = new Map(); // location ID -> {name, type, coordinates}
    }

    /**
     * Add a location to the map
     */
    addLocation(id, name, type = "point", coordinates = {x: 0, y: 0}) {
        this.locations.set(id, { name, type, coordinates });
    }

    /**
     * Add a road between two locations
     */
    addRoad(from, to, distance, roadType = "normal", isOneWay = false) {
        this.roads.set(`${from},${to}`, { distance, roadType });
        
        if (!isOneWay) {
            this.roads.set(`${to},${from}`, { distance, roadType });
        }
    }

    /**
     * Get road information between two locations
     */
    getRoad(from, to) {
        return this.roads.get(`${from},${to}`) || null;
    }

    /**
     * Get all neighboring locations (directly connected)
     */
    getNeighbors(locationId) {
        const neighbors = [];
        
        for (const [key, roadInfo] of this.roads) {
            const [from, to] = key.split(',').map(Number);
            if (from === locationId) {
                neighbors.push({
                    locationId: to,
                    locationName: this.locations.get(to)?.name,
                    distance: roadInfo.distance,
                    roadType: roadInfo.roadType
                });
            }
        }
        
        return neighbors;
    }

    /**
     * Dijkstra's shortest path algorithm
     */
    findShortestPath(startId, endId) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();

        // Initialize
        for (let i = 0; i < this.numLocations; i++) {
            if (this.locations.has(i)) {
                distances.set(i, Infinity);
                unvisited.add(i);
            }
        }
        distances.set(startId, 0);

        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let current = null;
            let minDist = Infinity;
            for (const node of unvisited) {
                const dist = distances.get(node);
                if (dist < minDist) {
                    minDist = dist;
                    current = node;
                }
            }

            if (current === null || minDist === Infinity) break;
            if (current === endId) break;

            unvisited.delete(current);

            // Check all neighbors
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor.locationId)) continue;

                const alt = distances.get(current) + neighbor.distance;
                if (alt < distances.get(neighbor.locationId)) {
                    distances.set(neighbor.locationId, alt);
                    previous.set(neighbor.locationId, current);
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = endId;
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current);
        }

        if (path[0] !== startId) {
            return { found: false, path: [], distance: Infinity };
        }

        return {
            found: true,
            path: path.map(id => ({
                id,
                name: this.locations.get(id)?.name
            })),
            distance: distances.get(endId)
        };
    }

    /**
     * Find all locations within a certain distance
     */
    findLocationsInRadius(centerID, maxDistance) {
        const result = [];
        const visited = new Set();
        const queue = [{id: centerID, distance: 0}];

        while (queue.length > 0) {
            const {id, distance} = queue.shift();
            
            if (visited.has(id)) continue;
            visited.add(id);

            if (distance > 0 && distance <= maxDistance) {
                result.push({
                    id,
                    name: this.locations.get(id)?.name,
                    distance
                });
            }

            const neighbors = this.getNeighbors(id);
            for (const neighbor of neighbors) {
                const newDistance = distance + neighbor.distance;
                if (newDistance <= maxDistance && !visited.has(neighbor.locationId)) {
                    queue.push({
                        id: neighbor.locationId,
                        distance: newDistance
                    });
                }
            }
        }

        return result.sort((a, b) => a.distance - b.distance);
    }

    /**
     * Find alternative routes (k-shortest paths)
     */
    findAlternativeRoutes(startId, endId, numRoutes = 3) {
        // Simplified: Find paths avoiding certain edges
        const routes = [];
        const mainRoute = this.findShortestPath(startId, endId);
        
        if (mainRoute.found) {
            routes.push(mainRoute);
            
            // Try removing each edge from main route to find alternatives
            for (let i = 0; i < mainRoute.path.length - 1 && routes.length < numRoutes; i++) {
                const from = mainRoute.path[i].id;
                const to = mainRoute.path[i + 1].id;
                
                // Temporarily remove edge
                const road = this.roads.get(`${from},${to}`);
                this.roads.delete(`${from},${to}`);
                
                const altRoute = this.findShortestPath(startId, endId);
                if (altRoute.found && altRoute.distance < Infinity) {
                    // Check if route is different enough
                    const isDifferent = JSON.stringify(altRoute.path) !== JSON.stringify(mainRoute.path);
                    if (isDifferent) {
                        routes.push(altRoute);
                    }
                }
                
                // Restore edge
                this.roads.set(`${from},${to}`, road);
            }
        }
        
        return routes;
    }

    /**
     * Calculate map statistics
     */
    getMapStats() {
        const totalPossibleRoads = this.numLocations * (this.numLocations - 1);
        const actualRoads = this.roads.size;
        const sparsity = 1 - (actualRoads / totalPossibleRoads);

        let totalDistance = 0;
        let roadTypeCounts = {};

        for (const [key, road] of this.roads) {
            totalDistance += road.distance;
            roadTypeCounts[road.roadType] = (roadTypeCounts[road.roadType] || 0) + 1;
        }

        return {
            totalLocations: this.numLocations,
            activeLocations: this.locations.size,
            totalRoads: actualRoads,
            possibleRoads: totalPossibleRoads,
            sparsity: sparsity.toFixed(4),
            averageDistance: (totalDistance / actualRoads).toFixed(2),
            roadTypes: roadTypeCounts
        };
    }

    /**
     * Display sparse matrix representation
     */
    displaySparseMatrix() {
        console.log("\n=== SPARSE ADJACENCY MATRIX (ROADS) ===");
        console.log("Format: (from, to) = distance [roadType]");
        
        const sortedRoads = Array.from(this.roads.entries()).sort();
        
        sortedRoads.forEach(([key, road]) => {
            const [from, to] = key.split(',').map(Number);
            const fromName = this.locations.get(from)?.name;
            const toName = this.locations.get(to)?.name;
            console.log(`(${from}:${fromName} → ${to}:${toName}) = ${road.distance}km [${road.roadType}]`);
        });
    }

    /**
     * Visualize the map as ASCII art
     */
    visualizeMap() {
        console.log("\n=== MAP VISUALIZATION ===");
        
        this.locations.forEach((loc, id) => {
            const neighbors = this.getNeighbors(id);
            console.log(`\n[${id}] ${loc.name} (${loc.type})`);
            
            neighbors.forEach(n => {
                console.log(`  ├─> ${n.locationName} (${n.distance}km, ${n.roadType})`);
            });
        });
    }
}

// ============================================
// DEMONSTRATION: CITY MAP SYSTEM
// ============================================

console.log("╔════════════════════════════════════════════════════╗");
console.log("║  SPARSE MATRIX: MAP & NAVIGATION APPLICATION      ║");
console.log("╚════════════════════════════════════════════════════╝\n");

// Create a map with 100 potential locations
const cityMap = new SparseMatrixMap(100);

// Add locations
const locations = [
    { id: 0, name: "City Center", type: "hub", coords: {x: 50, y: 50} },
    { id: 1, name: "North Station", type: "station", coords: {x: 50, y: 20} },
    { id: 2, name: "South Mall", type: "mall", coords: {x: 50, y: 80} },
    { id: 3, name: "East Park", type: "park", coords: {x: 80, y: 50} },
    { id: 4, name: "West Hospital", type: "hospital", coords: {x: 20, y: 50} },
    { id: 5, name: "Airport", type: "airport", coords: {x: 90, y: 90} },
    { id: 6, name: "University", type: "education", coords: {x: 30, y: 30} },
    { id: 7, name: "Beach", type: "recreation", coords: {x: 10, y: 70} },
    { id: 8, name: "Industrial Zone", type: "industrial", coords: {x: 70, y: 20} },
    { id: 9, name: "Residential Area", type: "residential", coords: {x: 60, y: 60} }
];

locations.forEach(loc => 
    cityMap.addLocation(loc.id, loc.name, loc.type, loc.coords)
);

// Add roads (sparse connections)
const roads = [
    [0, 1, 5.2, "highway"],      // City Center to North Station
    [0, 2, 6.8, "highway"],      // City Center to South Mall
    [0, 3, 4.5, "main"],         // City Center to East Park
    [0, 4, 3.8, "main"],         // City Center to West Hospital
    [1, 6, 4.0, "main"],         // North Station to University
    [1, 8, 5.5, "highway"],      // North Station to Industrial Zone
    [2, 5, 8.2, "highway"],      // South Mall to Airport
    [2, 9, 3.5, "local"],        // South Mall to Residential Area
    [3, 5, 7.0, "highway"],      // East Park to Airport
    [3, 9, 2.8, "local"],        // East Park to Residential Area
    [4, 6, 5.0, "main"],         // West Hospital to University
    [4, 7, 6.5, "scenic"],       // West Hospital to Beach
    [6, 7, 8.0, "scenic"],       // University to Beach
    [8, 5, 10.5, "highway"],     // Industrial Zone to Airport
    [9, 5, 5.5, "main"]          // Residential Area to Airport
];

roads.forEach(([from, to, dist, type]) => 
    cityMap.addRoad(from, to, dist, type)
);

// Display sparse matrix
cityMap.displaySparseMatrix();

// Visualize the map
cityMap.visualizeMap();

// Find shortest path
console.log("\n\n=== SHORTEST PATH: University → Airport ===");
const shortestPath = cityMap.findShortestPath(6, 5);
if (shortestPath.found) {
    console.log("Route found!");
    console.log("Path:", shortestPath.path.map(p => p.name).join(" → "));
    console.log(`Total Distance: ${shortestPath.distance.toFixed(2)} km`);
} else {
    console.log("No route found!");
}

// Find locations within radius
console.log("\n\n=== LOCATIONS WITHIN 10km OF CITY CENTER ===");
const nearbyLocations = cityMap.findLocationsInRadius(0, 10);
nearbyLocations.forEach(loc => {
    console.log(`${loc.name}: ${loc.distance.toFixed(2)} km away`);
});

// Find alternative routes
console.log("\n\n=== ALTERNATIVE ROUTES: City Center → Airport ===");
const altRoutes = cityMap.findAlternativeRoutes(0, 5, 3);
altRoutes.forEach((route, index) => {
    console.log(`\nRoute ${index + 1}:`);
    console.log("Path:", route.path.map(p => p.name).join(" → "));
    console.log(`Distance: ${route.distance.toFixed(2)} km`);
});

// Display map statistics
console.log("\n\n=== MAP STATISTICS ===");
const stats = cityMap.getMapStats();
console.log(`Total Locations: ${stats.totalLocations}`);
console.log(`Active Locations: ${stats.activeLocations}`);
console.log(`Total Roads: ${stats.totalRoads}`);
console.log(`Possible Roads: ${stats.possibleRoads}`);
console.log(`Sparsity: ${stats.sparsity} (${(stats.sparsity * 100).toFixed(2)}% is empty)`);
console.log(`Average Road Distance: ${stats.averageDistance} km`);
console.log("\nRoad Types:");
Object.entries(stats.roadTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} roads`);
});

// Memory comparison
console.log("\n\n=== MEMORY COMPARISON ===");
const denseSize = stats.totalLocations * stats.totalLocations * 8; // 8 bytes per float
const sparseSize = stats.totalRoads * 20; // approx 20 bytes per entry
console.log(`Dense Matrix: ${(denseSize / 1024).toFixed(2)} KB`);
console.log(`Sparse Matrix: ${(sparseSize / 1024).toFixed(2)} KB`);
console.log(`Memory Saved: ${((1 - sparseSize/denseSize) * 100).toFixed(2)}%`);

console.log("\n\n" + "=".repeat(60));
console.log("KEY INSIGHTS:");
console.log("=".repeat(60));
console.log("✓ Sparse matrices are perfect for map navigation systems");
console.log("✓ Most locations are NOT directly connected (sparse)");
console.log("✓ Enables efficient pathfinding algorithms (Dijkstra, A*)");
console.log("✓ Used in Google Maps, GPS, routing systems");
console.log("✓ Dramatically reduces memory usage for large maps");
console.log("✓ Fast neighbor lookup for navigation");
console.log("=".repeat(60));
