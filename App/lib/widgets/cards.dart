import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Resumenes.net'),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            const Text(
              'Bienvenido a Resumenes.net',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),

          
            ElevatedButton(
              onPressed: () {
                // Navegar a la pantalla de notas de estudio
              },
              child: const Text('Ver Notas de Estudio'),
            ),
          ],
        ),
      ),
    );
  }
}
