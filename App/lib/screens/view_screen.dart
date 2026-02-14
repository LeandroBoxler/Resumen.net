import 'package:flutter/material.dart';
import 'package:resumenes_app/Services/api_services.dart';
import 'package:resumenes_app/models/StudyNote.dart';




class ViewScreen extends StatelessWidget {
  final String id;
  final ApiService apiService = ApiService();
  
  ViewScreen({super.key, required this.id});


  @override
  Widget build(BuildContext context) {
    return Scaffold(
     appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Resumenes.net'),
      ),
body: FutureBuilder<StudyNote>(
  future: apiService.getStudyNote(id),
  builder: (context, snapshot) {

    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (snapshot.hasError) {
      return Center(
        child: Text('Error: ${snapshot.error}'),
      );
    }

    if (!snapshot.hasData) {
      return const Center(
        child: Text('No data found'),
      );
    }

    final studyNote = snapshot.data!;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Ver Resumen',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          Text('ID: ${studyNote.id}'),
          const SizedBox(height: 10),
          Text('Nombre: ${studyNote.name}'),
        ],
      ),
    );
  },
),

    );
  }
}
