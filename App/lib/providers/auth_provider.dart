import 'package:flutter/material.dart';
import 'package:resumenes_app/services/auth_token_service.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _token;
  String? _userId;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get token => _token;
  String? get userId => _userId;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      _isLoading = true;
      notifyListeners();

      _token = await AuthTokenService.getToken();
      _userId = await AuthTokenService.getUserId();
      _isAuthenticated = _token != null && _token!.isNotEmpty;
    } catch (e) {
      _isAuthenticated = false;
      _token = null;
      _userId = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> login(String token, {String? userId}) async {
    await AuthTokenService.saveToken(token);
    if (userId != null) {
      await AuthTokenService.saveUserId(userId);
    }
    
    _token = token;
    _userId = userId;
    _isAuthenticated = true;
    notifyListeners();
  }

  Future<void> logout() async {
    await AuthTokenService.clearToken();
    _token = null;
    _userId = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  Future<void> refreshAuthStatus() async {
    await _checkAuthStatus();
  }
}
