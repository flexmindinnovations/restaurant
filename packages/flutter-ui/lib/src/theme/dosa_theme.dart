import 'package:cupertino_ui/cupertino_ui.dart' show CupertinoPageTransitionsBuilder;
import 'package:material_ui/material_ui.dart';

import '../tokens/dosa_tokens.g.dart';

/// Gives widgets access to the full DOSA semantic token set:
/// `DosaTheme.of(context).tokens.textPrimary`.
@immutable
class DosaTheme extends ThemeExtension<DosaTheme> {
  const DosaTheme(this.tokens);

  final DosaThemeTokens tokens;

  static DosaThemeTokens of(BuildContext context) =>
      Theme.of(context).extension<DosaTheme>()?.tokens ?? DosaThemeTokens.staffLight;

  @override
  DosaTheme copyWith({DosaThemeTokens? tokens}) => DosaTheme(tokens ?? this.tokens);

  /// Token sets are discrete; theme changes cross-fade at the halfway point
  /// (the surrounding AnimatedTheme interpolates Material colours smoothly).
  @override
  DosaTheme lerp(covariant DosaTheme? other, double t) => t < 0.5 || other == null ? this : other;
}

/// Builds Material [ThemeData] from a DOSA token set. Material components pick up DOSA colour,
/// type and shape; DOSA-specific values (glass, grain, gradients, order states) live on
/// [DosaTheme].
ThemeData buildDosaTheme(DosaThemeTokens t) {
  final brightness = t.isDark ? Brightness.dark : Brightness.light;
  final scheme = ColorScheme(
    brightness: brightness,
    primary: t.actionPrimaryBg,
    onPrimary: t.actionPrimaryFg,
    primaryContainer: t.actionSecondaryBg,
    onPrimaryContainer: t.actionSecondaryFg,
    secondary: t.brandSecondary,
    onSecondary: t.textOnSecondary,
    secondaryContainer: t.brandSecondarySubtle,
    onSecondaryContainer: t.brandSecondaryStrong,
    tertiary: t.brandAccent,
    onTertiary: t.textOnSecondary,
    error: t.statusErrorSolid,
    onError: t.statusErrorOnSolid,
    errorContainer: t.statusErrorBg,
    onErrorContainer: t.statusErrorFg,
    surface: t.surfacePrimary,
    onSurface: t.textPrimary,
    onSurfaceVariant: t.textSecondary,
    surfaceContainerLowest: t.surfacePrimary,
    surfaceContainerLow: t.surfacePrimary,
    surfaceContainer: t.surfaceSecondary,
    surfaceContainerHigh: t.surfaceElevated,
    surfaceContainerHighest: t.surfaceSunken,
    outline: t.borderDefault,
    outlineVariant: t.borderSubtle,
    inverseSurface: t.surfaceInverse,
    onInverseSurface: t.textInverse,
    inversePrimary: t.brandPrimary,
    shadow: t.shadowKey,
    scrim: t.surfaceScrim,
    surfaceTint: Colors.transparent,
  );

  TextStyle c(TextStyle s, Color color) => s.copyWith(color: color);
  final textTheme = TextTheme(
    displayLarge: c(DosaTypeScale.displayLg, t.textPrimary),
    displayMedium: c(DosaTypeScale.displayMd, t.textPrimary),
    displaySmall: c(DosaTypeScale.headingH1, t.textPrimary),
    headlineLarge: c(DosaTypeScale.headingH1, t.textPrimary),
    headlineMedium: c(DosaTypeScale.headingH2, t.textPrimary),
    headlineSmall: c(DosaTypeScale.headingH3, t.textPrimary),
    titleLarge: c(DosaTypeScale.headingH3, t.textPrimary),
    titleMedium: c(DosaTypeScale.headingH4, t.textPrimary),
    titleSmall: c(DosaTypeScale.headingH5, t.textPrimary),
    bodyLarge: c(DosaTypeScale.bodyLg, t.textPrimary),
    bodyMedium: c(DosaTypeScale.bodyMd, t.textPrimary),
    bodySmall: c(DosaTypeScale.bodySm, t.textSecondary),
    labelLarge: c(DosaTypeScale.labelLg, t.textPrimary),
    labelMedium: c(DosaTypeScale.labelMd, t.textPrimary),
    labelSmall: c(DosaTypeScale.labelSm, t.textSecondary),
  );

  const controlShape = RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(DosaRadius.sm)));
  const buttonPadding = EdgeInsets.symmetric(horizontal: DosaSpace.s5);
  const buttonSize = Size(64, DosaSize.controlLg);

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    textTheme: textTheme,
    fontFamily: 'Inter',
    package: 'dosa_ui',
    scaffoldBackgroundColor: t.backgroundCanvas,
    canvasColor: t.backgroundCanvas,
    dividerColor: t.borderSubtle,
    splashFactory: InkSparkle.splashFactory,
    materialTapTargetSize: MaterialTapTargetSize.padded,
    focusColor: t.focusRingHalo,
    hoverColor: t.stateHoverOverlay,
    highlightColor: t.statePressOverlay,
    disabledColor: t.stateDisabledFg,
    extensions: <ThemeExtension<dynamic>>[DosaTheme(t)],
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: t.actionPrimaryBg,
        foregroundColor: t.actionPrimaryFg,
        disabledBackgroundColor: t.stateDisabledBg,
        disabledForegroundColor: t.stateDisabledFg,
        minimumSize: buttonSize,
        padding: buttonPadding,
        shape: controlShape,
        textStyle: DosaTypeScale.labelLg,
        animationDuration: DosaDuration.quick,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: t.actionNeutralFg,
        backgroundColor: t.actionNeutralBg,
        side: BorderSide(color: t.borderDefault),
        minimumSize: buttonSize,
        padding: buttonPadding,
        shape: controlShape,
        textStyle: DosaTypeScale.labelLg,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: t.actionTertiaryFg,
        minimumSize: buttonSize,
        padding: const EdgeInsets.symmetric(horizontal: DosaSpace.s3),
        shape: controlShape,
        textStyle: DosaTypeScale.labelLg,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: t.surfacePrimary,
      contentPadding: const EdgeInsets.symmetric(horizontal: DosaSpace.s4, vertical: DosaSpace.s3),
      hintStyle: DosaTypeScale.bodyLg.copyWith(color: t.textTertiary),
      labelStyle: DosaTypeScale.bodyMd.copyWith(color: t.textSecondary),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(DosaRadius.sm), borderSide: BorderSide(color: t.borderDefault)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(DosaRadius.sm), borderSide: BorderSide(color: t.borderDefault)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(DosaRadius.sm), borderSide: BorderSide(color: t.focusRing, width: 2)),
      errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(DosaRadius.sm), borderSide: BorderSide(color: t.statusErrorFg)),
    ),
    cardTheme: CardThemeData(
      color: t.surfacePrimary,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DosaRadius.md),
        side: BorderSide(color: t.borderSubtle),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: t.surfaceElevated,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(DosaRadius.lg))),
      titleTextStyle: DosaTypeScale.headingH4.copyWith(color: t.textPrimary),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: t.surfaceElevated,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(DosaRadius.lg))),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: t.surfaceInverse,
      contentTextStyle: DosaTypeScale.bodyMd.copyWith(color: t.textInverse),
      behavior: SnackBarBehavior.floating,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(DosaRadius.md))),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: t.glassSubtleTint,
      indicatorColor: t.brandPrimarySubtle,
      height: 72,
      labelTextStyle: WidgetStatePropertyAll(DosaTypeScale.labelSm.copyWith(color: t.textSecondary)),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: <TargetPlatform, PageTransitionsBuilder>{
        TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
  );
}
