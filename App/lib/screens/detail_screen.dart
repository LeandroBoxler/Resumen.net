import 'package:flutter/material.dart';
import 'package:resumenes_app/services/api_service.dart';
import 'package:resumenes_app/models/StudyNote.dart';

class DetailScreen extends StatefulWidget {
  final String id;
  final bool isEditable;
  
  const DetailScreen({
    super.key, 
    required this.id,
    this.isEditable = false,
  });

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
    _studyNoteFuture = _loadNote();
  }

  Future<StudyNote> _loadNote() async {
    final note = await apiService.getStudyNote(widget.id);
    _nameController.text = note.name;
    return note;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.isEditable ? 'Editar Resumen' : 'Ver Resumen'),
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
              child: Text('No se encontró la nota'),
            );
          }

          final studyNote = snapshot.data!;

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del Resumen',
                      border: OutlineInputBorder(),
                    ),
                    readOnly: !widget.isEditable,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Campo requerido';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  if (widget.isEditable)
                    ElevatedButton(
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          final note = StudyNote(name: _nameController.text);

                          try {
                            await apiService.updateStudyNote(
                              widget.id,
                              note,
                            );

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Resumen actualizado exitosamente'),
                                ),
                              );
                              Navigator.pop(context, true);
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
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }
}
