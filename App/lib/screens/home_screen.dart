import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:resumenes_app/providers/auth_provider.dart';
import 'package:resumenes_app/services/api_service.dart';
import 'package:resumenes_app/services/favorites_service.dart';
import 'package:resumenes_app/models/StudyNote.dart';
import 'package:resumenes_app/screens/detail_screen.dart';
import 'package:resumenes_app/screens/login_screen.dart';
import 'package:resumenes_app/screens/register_screen.dart';
import 'package:resumenes_app/screens/my_notes_screen.dart';
import 'package:resumenes_app/screens/favorites_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();
  final FavoritesService favoritesService = FavoritesService();
  late Future<List<StudyNote>> _notesFuture;
  bool _isLoggedIn = false;
  List<String> _favoriteIds = [];

  @override
  void initState() {
    super.initState();
    _notesFuture = apiService.getStudyNotes();
    _loadData();
  }

  Future<void> _loadData() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final isLoggedIn = authProvider.isAuthenticated;

    if (isLoggedIn) {
      if (mounted) {
        setState(() {
          _isLoggedIn = true;
        });
      }

      try {
        final favorites = await favoritesService.getUserFavorites();
        if (mounted) {
          setState(() {
            _isLoggedIn = isLoggedIn;
            _favoriteIds = favorites.map((f) => f.noteId).toList();
          });
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _isLoggedIn = true;
            _favoriteIds = [];
          });
        }
      }
    } else {
      if (mounted) {
        setState(() {
          _isLoggedIn = false;
          _favoriteIds = [];
        });
      }
    }
  }

  Future<void> _toggleFavorite(String noteId) async {
    try {
      if (_favoriteIds.contains(noteId)) {
        await favoritesService.removeFavorite(noteId);
        setState(() {
          _favoriteIds.remove(noteId);
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Eliminado de favoritos')),
          );
        }
      } else {
        await favoritesService.addFavorite(noteId);
        setState(() {
          _favoriteIds.add(noteId);
        });
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('Agregado a favoritos')));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> _logout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();

    setState(() {
      _isLoggedIn = false;
      _favoriteIds = [];
    });

    if (mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Sesión cerrada')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Resumenes.net'),
        actions: _isLoggedIn
            ? [
                TextButton(onPressed: _logout, child: const Text('Desloguear')),
                const SizedBox(width: 8),
              ]
            : [
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const LoginScreen(),
                      ),
                    ).then((_) => _loadData());
                  },
                  child: const Text('Login'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const RegisterScreen(),
                      ),
                    ).then((_) => _loadData());
                  },
                  child: const Text('Register'),
                ),
                const SizedBox(width: 8),
              ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.inversePrimary,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Text(
                    'Resumenes.net',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _isLoggedIn ? 'Usuario logueado' : 'Deslogueado',
                    style: const TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Inicio'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            if (_isLoggedIn) ...[
              ListTile(
                leading: const Icon(Icons.note),
                title: const Text('Mis Notas'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MyNotesScreen(),
                    ),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.favorite),
                title: const Text('Mis Favoritos'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const FavoritesScreen(),
                    ),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Cerrar Sesión'),
                onTap: () {
                  Navigator.pop(context);
                  _logout();
                },
              ),
            ] else ...[
              ListTile(
                leading: const Icon(Icons.login),
                title: const Text('Iniciar Sesión'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoginScreen(),
                    ),
                  ).then((_) => _loadData());
                },
              ),
              ListTile(
                leading: const Icon(Icons.person_add),
                title: const Text('Registrarse'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RegisterScreen(),
                    ),
                  ).then((_) => _loadData());
                },
              ),
            ],
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Text(
              'Todos los Resúmenes',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            Expanded(
              child: FutureBuilder<List<StudyNote>>(
                future: _notesFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (snapshot.hasError) {
                    return Center(
                      child: Text(
                        'Error: ${snapshot.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    );
                  }

                  if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(
                      child: Text('No hay resúmenes disponibles'),
                    );
                  }

                  final studyNotes = snapshot.data!;
                  return ListView.builder(
                    itemCount: studyNotes.length,
                    itemBuilder: (context, index) {
                      final studyNote = studyNotes[index];
                      final isFavorite = _favoriteIds.contains(studyNote.id);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(studyNote.name),
                          trailing: _isLoggedIn
                              ? IconButton(
                                  icon: Icon(
                                    isFavorite
                                        ? Icons.favorite
                                        : Icons.favorite_border,
                                    color: isFavorite ? Colors.red : null,
                                  ),
                                  onPressed: () {
                                    _toggleFavorite(studyNote.id!);
                                  },
                                )
                              : null,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => DetailScreen(
                                  id: studyNote.id!,
                                  isEditable: false,
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
