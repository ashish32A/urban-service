const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // ── JWT Auth Middleware ────────────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection Handler ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    logger.info(`[Socket] Connected: ${socket.userId} (${socket.userRole})`);

    // Join personal rooms
    socket.join(`user_${socket.userId}`);
    if (socket.userRole === 'vendor') {
      socket.join(`vendor_${socket.userId}`);
    }

    // Vendor location tracking (during in_progress)
    socket.on('vendor:location', (data) => {
      // Emit to the customer's room
      if (data.customerId) {
        io.to(`user_${data.customerId}`).emit('vendor:location', {
          lat: data.lat,
          lng: data.lng,
          vendorId: socket.userId,
        });
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket] Disconnected: ${socket.userId} — ${reason}`);
    });

    socket.on('error', (err) => {
      logger.error(`[Socket] Error for ${socket.userId}:`, err.message);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
