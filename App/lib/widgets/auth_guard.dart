import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:resumenes_app/providers/auth_provider.dart';
import 'package:resumenes_app/screens/login_screen.dart';


class AuthGuard extends StatelessWidget {
  final Widget child;
  final String? redirectMessage;

  const AuthGuard({
    super.key,
    required this.child,
    this.redirectMessage,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (authProvider.isAuthenticated) {
          return child;
        }

        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (redirectMessage != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(redirectMessage!)),
            );
          }
          
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const LoginScreen()),
          );
        });

        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      },
    );
  }
}
