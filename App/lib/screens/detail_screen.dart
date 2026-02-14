import 'package:flutter/material.dart';
import 'package:resumenes_app/Services/api_services.dart';
import 'package:resumenes_app/models/StudyNote.dart';
import 'package:resumenes_app/components/text_form.dart';


class DetailScreen extends StatefulWidget {
  final String id;
  
  DetailScreen({super.key, required this.id});
  @override
  State<DetailScreen> createState() => _DetailScreenState();
}



class _DetailScreenState extends State<DetailScreen> {
  final ApiService apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();

  late Future<StudyNote> _studyNoteFuture;

@override
void initState() {
  super.initState();
  _studyNoteFuture = apiService.getStudyNote(widget.id);

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
     appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Resumenes.net'),
      ),
  body: FutureBuilder<StudyNote>(
  future: _studyNoteFuture,
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
           TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Nombre',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value!.isEmpty ? 'Campo requerido' : null,
                  ),
                  ElevatedButton(
  onPressed: () async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final note = StudyNote(name: _nameController.text);

      try {
        await apiService.updateStudyNote(
          widget.id, 
          note  
        );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Resumen actualizado exitosamente'),
            ),
          );

          Navigator.pop(context); 
        }

      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      }
    }
  },
  child: const Text('Actualizar Resumen'),
)
        ],
      ),
    );
  },
),

    );
  }
}
