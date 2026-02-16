import 'package:json_annotation/json_annotation.dart';

part 'StudyNote.g.dart';

@JsonSerializable()
class StudyNote {
  @JsonKey(includeIfNull: false)
  final String? id;
  final String name;
  final String? description;
  final String? pdfLink;

  StudyNote({
    this.id,
    required this.name,
    this.description,
    this.pdfLink,
  });

  factory StudyNote.fromJson(Map<String, dynamic> json) => 
      _$StudyNoteFromJson(json);

  Map<String, dynamic> toJson() => _$StudyNoteToJson(this);
}

@JsonSerializable()
class UserFavorite {
  final String userId;
  final String noteId;
  
  @JsonKey(includeIfNull: false)
  final StudyNote? studyNote;

  UserFavorite({
    required this.userId,
    required this.noteId,
    this.studyNote,
  });

  factory UserFavorite.fromJson(Map<String, dynamic> json) => 
      _$UserFavoriteFromJson(json);

  Map<String, dynamic> toJson() => _$UserFavoriteToJson(this);
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

