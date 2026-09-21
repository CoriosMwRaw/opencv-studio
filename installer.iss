; Script de Inno Setup 6 para OpenCV Studio
; Creado por CoriosTech

#define MyAppName "OpenCV Studio"
#define MyAppVersion "1.3.3"
#define MyAppPublisher "CoriosTech"
#define MyAppURL "https://github.com/CoriosMwRaw/opencv-studio"
#define MyAppExeName "OpenCV Studio.exe"

[Setup]
; Identificador único de aplicación (GUID generado para OpenCV Studio)
AppId={{C8E19B2D-4F7A-4E91-8C53-81D2395EF10A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} v{#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}/releases
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppPublisher}\{#MyAppName}
DisableProgramGroupPage=auto
AllowNoIcons=yes
OutputDir=dist\installer
OutputBaseFilename=OpenCV_Studio_v{#MyAppVersion}_Setup
SetupIconFile=assets\icon.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64
UninstallDisplayIcon={app}\{#MyAppExeName}
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription={#MyAppName} - Creador Profesional de CV & Auditor ATS
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "dist\OpenCV Studio-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:ProgramOnTheWeb,{#MyAppName}}"; Filename: "{#MyAppURL}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
