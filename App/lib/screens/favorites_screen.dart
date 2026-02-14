import 'package:flutter/material.dart';
import 'package:resumenes_app/Services/api_services.dart';
import 'package:resumenes_app/models/StudyNote.dart';
import "package:resumenes_app/screens/create_screen.dart";
import 'package:resumenes_app/screens/view_screen.dart';
import 'package:resumenes_app/screens/register_screen.dart';

class HomeScreen extends StatelessWidget {
  final ApiService apiService = ApiService();

  HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
   appBar: AppBar(
  automaticallyImplyLeading: true,
  backgroundColor: Theme.of(context).colorScheme.inversePrimary,
  title: const Text('Resumenes.net'),
),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Text(
              'Bienvenido a Resumenes.net',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            Expanded(
              child: FutureBuilder<List<StudyNote>>(
                future: apiService.getStudyNotes(),
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
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(studyNote.name),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () async {
                              Navigator.push(
                                context,
                                MaterialPageRoute(    builder: (context) => ViewScreen(id: studyNote.id!),
),
                                );
                            
                            },
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => CreateScreen()),
                );
              },
              child: const Text('Agregar Nota de Estudio'),
            ),
             ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => RegisterScreen()),
                );
              },
              child: const Text('Registrarse'),
            ),
          ],
        ),
      ),
    );
  }
}
