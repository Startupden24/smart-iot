// Function
const logout = (req, res) => {
    // For client-side handling, no server action needed
    res.json({ message: 'Logged out successfully' });
};

module.exports = { logout }