const { StatusCodes } = require('http-status-codes');
const { AuthService } = require('../services');

const signup = async (req, res) => {
  try {
    const { email, password, codeforces_handle } = req.body;

    if (!email || !password || !codeforces_handle) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email, password, and Codeforces handle are required',
        error: {},
        data: {},
      });
    }

    const result = await AuthService.signup(email, password, codeforces_handle);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      error: {},
      data: result,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Signup failed',
      error: { message: error.message },
      data: {},
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required',
        error: {},
        data: {},
      });
    }

    const result = await AuthService.login(email, password);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      error: {},
      data: result,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || 'Login failed',
      error: { message: error.message },
      data: {},
    });
  }
};

module.exports = {
  signup,
  login,
};

