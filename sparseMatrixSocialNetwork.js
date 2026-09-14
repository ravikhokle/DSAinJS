/**
 * SPARSE MATRIX APPLICATION: SOCIAL NETWORK
 * 
 * In social networks, sparse matrices are ideal because:
 * - Most users are NOT connected to most other users
 * - Storing only actual connections saves massive memory
 * - Example: Facebook has billions of users, but each user has only ~300-500 friends
 */

class SparseMatrixSocialNetwork {
    constructor(numUsers) {
        this.numUsers = numUsers;
        // Store only non-zero values (connections)
        this.connections = new Map(); // key: "row,col", value: connection strength
        this.userNames = new Map();
    }

    /**
     * Add a user to the network
     */
    addUser(userId, userName) {
        if (userId >= this.numUsers) {
            throw new Error("User ID exceeds network capacity");
        }
        this.userNames.set(userId, userName);
    }

    /**
     * Create a connection between two users
     * @param {number} user1 - First user ID
     * @param {number} user2 - Second user ID
     * @param {number} strength - Connection strength (1-10)
     */
    addConnection(user1, user2, strength = 1) {
        if (user1 === user2) return; // No self-connections
        
        // Store both directions for undirected graph
        this.connections.set(`${user1},${user2}`, strength);
        this.connections.set(`${user2},${user1}`, strength);
    }

    /**
     * Remove a connection between users
     */
    removeConnection(user1, user2) {
        this.connections.delete(`${user1},${user2}`);
        this.connections.delete(`${user2},${user1}`);
    }

    /**
     * Get connection strength between two users
     */
    getConnection(user1, user2) {
        return this.connections.get(`${user1},${user2}`) || 0;
    }

    /**
     * Get all friends of a user
     */
    getFriends(userId) {
        const friends = [];
        for (const [key, strength] of this.connections) {
            const [user1, user2] = key.split(',').map(Number);
            if (user1 === userId) {
                friends.push({
                    userId: user2,
                    userName: this.userNames.get(user2),
                    strength: strength
                });
            }
        }
        return friends;
    }

    /**
     * Find mutual friends between two users
     */
    getMutualFriends(user1, user2) {
        const friends1 = new Set(this.getFriends(user1).map(f => f.userId));
        const friends2 = this.getFriends(user2);
        
        return friends2.filter(f => friends1.has(f.userId));
    }

    /**
     * Suggest friends based on mutual connections
     */
    suggestFriends(userId, maxSuggestions = 5) {
        const directFriends = new Set(this.getFriends(userId).map(f => f.userId));
        const suggestions = new Map(); // friendId -> mutual connection count

        // Find friends of friends
        for (const friendId of directFriends) {
            const friendsOfFriend = this.getFriends(friendId);
            
            for (const fof of friendsOfFriend) {
                // Skip if already a friend or self
                if (fof.userId === userId || directFriends.has(fof.userId)) {
                    continue;
                }
                
                suggestions.set(fof.userId, (suggestions.get(fof.userId) || 0) + 1);
            }
        }

        // Sort by mutual connection count
        return Array.from(suggestions.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxSuggestions)
            .map(([userId, mutualCount]) => ({
                userId,
                userName: this.userNames.get(userId),
                mutualConnections: mutualCount
            }));
    }

    /**
     * Calculate clustering coefficient (how connected a user's friends are)
     */
    getClusteringCoefficient(userId) {
        const friends = this.getFriends(userId);
        const k = friends.length;
        
        if (k < 2) return 0; // Need at least 2 friends
        
        let actualConnections = 0;
        for (let i = 0; i < friends.length; i++) {
            for (let j = i + 1; j < friends.length; j++) {
                if (this.getConnection(friends[i].userId, friends[j].userId) > 0) {
                    actualConnections++;
                }
            }
        }
        
        const possibleConnections = (k * (k - 1)) / 2;
        return actualConnections / possibleConnections;
    }

    /**
     * Get network statistics
     */
    getNetworkStats() {
        const totalPossibleConnections = (this.numUsers * (this.numUsers - 1)) / 2;
        const actualConnections = this.connections.size / 2; // Divide by 2 for undirected
        const sparsity = 1 - (actualConnections / totalPossibleConnections);
        
        return {
            totalUsers: this.numUsers,
            activeUsers: this.userNames.size,
            totalConnections: actualConnections,
            possibleConnections: totalPossibleConnections,
            sparsity: sparsity.toFixed(4),
            memoryEfficiency: `${((1 - sparsity) * 100).toFixed(2)}% storage used`
        };
    }

    /**
     * Display the sparse matrix representation
     */
    displaySparseMatrix() {
        console.log("\n=== SPARSE MATRIX REPRESENTATION ===");
        console.log("Format: (row, col, value)");
        
        const sortedEntries = Array.from(this.connections.entries())
            .filter(([key]) => {
                const [r, c] = key.split(',').map(Number);
                return r <= c; // Only show upper triangle
            })
            .sort();

        sortedEntries.forEach(([key, value]) => {
            const [row, col] = key.split(',').map(Number);
            const user1Name = this.userNames.get(row) || `User${row}`;
            const user2Name = this.userNames.get(col) || `User${col}`;
            console.log(`(${row}:${user1Name}, ${col}:${user2Name}) = ${value}`);
        });
    }
}

// ============================================
// DEMONSTRATION AND TESTING
// ============================================

console.log("╔════════════════════════════════════════════════════╗");
console.log("║  SPARSE MATRIX: SOCIAL NETWORK APPLICATION         ║");
console.log("╚════════════════════════════════════════════════════╝\n");

// Create a social network with 1000 users
const network = new SparseMatrixSocialNetwork(1000);

// Add some users
const users = [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
    { id: 2, name: "Charlie" },
    { id: 3, name: "Diana" },
    { id: 4, name: "Eve" },
    { id: 5, name: "Frank" },
    { id: 6, name: "Grace" },
    { id: 7, name: "Henry" },
    { id: 8, name: "Ivy" },
    { id: 9, name: "Jack" }
];

users.forEach(user => network.addUser(user.id, user.name));

// Create connections (friendship graph)
const connections = [
    [0, 1, 5], [0, 2, 4], [0, 3, 3],  // Alice's connections
    [1, 2, 5], [1, 4, 4],              // Bob's connections
    [2, 3, 5], [2, 5, 3],              // Charlie's connections
    [3, 6, 4],                         // Diana's connections
    [4, 7, 5], [4, 8, 3],              // Eve's connections
    [5, 6, 4], [5, 9, 2],              // Frank's connections
    [6, 9, 5],                         // Grace's connections
    [7, 8, 4],                         // Henry's connections
    [8, 9, 3]                          // Ivy's connections
];

connections.forEach(([u1, u2, strength]) => 
    network.addConnection(u1, u2, strength)
);

// Display sparse matrix
network.displaySparseMatrix();

// Get Alice's friends
console.log("\n\n=== ALICE'S FRIENDS ===");
const aliceFriends = network.getFriends(0);
aliceFriends.forEach(friend => {
    console.log(`${friend.userName} (strength: ${friend.strength})`);
});

// Find mutual friends between Alice and Bob
console.log("\n\n=== MUTUAL FRIENDS: Alice & Bob ===");
const mutualFriends = network.getMutualFriends(0, 1);
mutualFriends.forEach(friend => {
    console.log(`${friend.userName}`);
});

// Suggest friends for Eve
console.log("\n\n=== FRIEND SUGGESTIONS FOR EVE ===");
const suggestions = network.suggestFriends(4);
suggestions.forEach(suggestion => {
    console.log(`${suggestion.userName} (${suggestion.mutualConnections} mutual connections)`);
});

// Calculate clustering coefficient for Alice
console.log("\n\n=== CLUSTERING COEFFICIENT ===");
const aliceCluster = network.getClusteringCoefficient(0);
console.log(`Alice's clustering coefficient: ${aliceCluster.toFixed(3)}`);
console.log(`(${(aliceCluster * 100).toFixed(1)}% of Alice's friends are also friends with each other)`);

// Display network statistics
console.log("\n\n=== NETWORK STATISTICS ===");
const stats = network.getNetworkStats();
console.log(`Total Users: ${stats.totalUsers}`);
console.log(`Active Users: ${stats.activeUsers}`);
console.log(`Total Connections: ${stats.totalConnections}`);
console.log(`Possible Connections: ${stats.possibleConnections}`);
console.log(`Sparsity: ${stats.sparsity} (${(stats.sparsity * 100).toFixed(2)}% of matrix is zero)`);
console.log(`Memory Efficiency: ${stats.memoryEfficiency}`);

// Calculate memory savings
console.log("\n\n=== MEMORY COMPARISON ===");
const denseMatrixSize = stats.totalUsers * stats.totalUsers * 4; // 4 bytes per int
const sparseMatrixSize = stats.totalConnections * 2 * 12; // 2 ints + 1 value per entry
console.log(`Dense Matrix Storage: ${(denseMatrixSize / 1024).toFixed(2)} KB`);
console.log(`Sparse Matrix Storage: ${(sparseMatrixSize / 1024).toFixed(2)} KB`);
console.log(`Memory Saved: ${((1 - sparseMatrixSize/denseMatrixSize) * 100).toFixed(2)}%`);

console.log("\n\n" + "=".repeat(60));
console.log("KEY INSIGHTS:");
console.log("=".repeat(60));
console.log("✓ Sparse matrices save enormous memory in social networks");
console.log("✓ Most users are NOT connected to most other users");
console.log("✓ Only actual friendships are stored, not zeros");
console.log("✓ Enables efficient friend suggestions and recommendations");
console.log("✓ Fast lookup of connections and mutual friends");
console.log("=".repeat(60));
