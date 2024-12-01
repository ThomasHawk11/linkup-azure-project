function sanitizeUser(user) {
    // Remove sensitive information before sending to client
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.passwordHash;
    delete sanitizedUser.securityQuestions;
    delete sanitizedUser.resetToken;
    return sanitizedUser;
  }
  
  module.exports = {
    sanitizeUser
  };