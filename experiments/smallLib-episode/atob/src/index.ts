/*
const originalString = "Hello, World!";
const base64Encoded = btoa(originalString);
console.log(base64Encoded); // Outputs: "SGVsbG8sIFdvcmxkIQ=="
const decodedString = atob(base64Encoded);
console.log(decodedString); // Outputs: "Hello, World!"
*/

// Function to encode a string to base-64
function encodeToBase64(input: string): string {
    return btoa(input);
}

// Function to decode a base-64 string
function decodeFromBase64(encoded: string): string {
    return atob(encoded);
}

const originalString = "Hello, World!";
const base64Encoded = encodeToBase64(originalString);
console.log(`Base-64 Encoded: ${base64Encoded}`); // Outputs: "SGVsbG8sIFdvcmxkIQ=="

const decodedString = decodeFromBase64(base64Encoded);
console.log(`Decoded String: ${decodedString}`); // Outputs: "Hello, World!"