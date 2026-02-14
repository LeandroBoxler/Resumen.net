import 'package:json_annotation/json_annotation.dart';

part 'StudyNote.g.dart';

@JsonSerializable()
class StudyNote {
  @JsonKey(includeIfNull: false)
  final String? id;
  final String name;

  StudyNote({
    this.id,
    required this.name,
  });

  factory StudyNote.fromJson(Map<String, dynamic> json) => 
      _$StudyNoteFromJson(json);

  Map<String, dynamic> toJson() => _$StudyNoteToJson(this);
}

@JsonSerializable()
class Auth {
  @JsonKey(includeToJson: false, includeFromJson: false)
  final String? id;
  
  @JsonKey(name: 'FirstName')
  final String firstName;
  
  @JsonKey(name: 'LastName')
  final String lastName;
  
  @JsonKey(name: 'Email')
  final String email;
  
  @JsonKey(name: 'Password')
  final String password;
  
  Auth({
    this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
  });

  factory Auth.fromJson(Map<String, dynamic> json) => 
      _$AuthFromJson(json);

  Map<String, dynamic> toJson() => _$AuthToJson(this);
}

