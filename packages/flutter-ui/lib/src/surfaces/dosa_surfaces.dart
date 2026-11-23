import 'dart:ui' as ui;

import 'package:material_ui/material_ui.dart';

import '../theme/dosa_theme.dart';
import '../tokens/dosa_tokens.g.dart';

/// The four DOSA glass recipes. Values come from tokens so web and Flutter match.
enum DosaGlassVariant { subtle, standard, premium, dark }

/// Whether glass may blur. Set `DosaGlassScope(enabled: false)` high in the tree on low-end
/// devices or when the platform reports reduced transparency; glass then renders its opaque
/// fallback (no BackdropFilter, no saveLayer).
class DosaGlassScope extends InheritedWidget {
  const DosaGlassScope({super.key, required this.enabled, required super.child});

  final bool enabled;

  static bool of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<DosaGlassScope>()?.enabled ?? true;

  @override
  bool updateShouldNotify(DosaGlassScope oldWidget) => enabled != oldWidget.enabled;
}

/// Frosted-glass surface: clipped BackdropFilter blur + translucent tint + light edge +
/// inner top highlight + token shadow. Text stays crisp because only the backdrop is filtered.
///
/// Performance: each instance costs one saveLayer. Use for floating chrome (nav bars, toolbars,
/// hero panels, overlays), never for list items or table rows.
class DosaGlass extends StatelessWidget {
  const DosaGlass({
    super.key,
    this.variant = DosaGlassVariant.standard,
    this.borderRadius,
    this.padding = const EdgeInsets.all(DosaSpace.s4),
    required this.child,
  });

  final DosaGlassVariant variant;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry padding;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    final blurEnabled = DosaGlassScope.of(context);
    final isDarkGlass = variant == DosaGlassVariant.dark;

    final (Color tint, double blur, List<BoxShadow> shadow, double radius) = switch (variant) {
      DosaGlassVariant.subtle => (t.glassSubtleTint, t.glassBlurSubtle, t.shadow1, DosaRadius.md),
      DosaGlassVariant.standard => (t.glassStandardTint, t.glassBlurStandard, t.shadow2, DosaRadius.lg),
      DosaGlassVariant.premium => (t.glassPremiumTint, t.glassBlurPremium, t.shadow3, DosaRadius.xl),
      DosaGlassVariant.dark => (t.glassDarkTint, t.glassBlurDark, t.shadow3, DosaRadius.lg),
    };
    final r = borderRadius ?? BorderRadius.circular(radius);
    final fallback = isDarkGlass ? t.glassFallbackDark : t.glassFallback;
    final border = isDarkGlass ? t.glassBorderDark : t.glassBorder;
    final highlight = isDarkGlass ? t.glassHighlightDark : t.glassHighlight;

    // CSS blur(Npx) is a Gaussian with σ = N; Flutter's sigma matches, so token values carry over.
    Widget body = DecoratedBox(
      decoration: BoxDecoration(
        color: blurEnabled ? tint : fallback,
        borderRadius: r,
        border: Border.all(color: border),
        gradient: variant == DosaGlassVariant.premium
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.center,
                colors: <Color>[DosaPalette.white.withValues(alpha: 0.18), DosaPalette.white.withValues(alpha: 0)],
              )
            : null,
      ),
      child: DecoratedBox(
        // 1px inner top highlight.
        decoration: BoxDecoration(
          borderRadius: r,
          border: Border(top: BorderSide(color: highlight)),
        ),
        child: Padding(
          padding: padding,
          child: DefaultTextStyle.merge(
            style: TextStyle(color: isDarkGlass ? DosaPalette.brandPearl : t.textPrimary),
            child: child,
          ),
        ),
      ),
    );

    if (blurEnabled) {
      body = ClipRRect(
        borderRadius: r,
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: blur, sigmaY: blur, tileMode: TileMode.mirror),
          child: body,
        ),
      );
    }
    return DecoratedBox(
      decoration: BoxDecoration(borderRadius: r, boxShadow: shadow),
      child: body,
    );
  }
}

/// Paper-grain layer. Paints a 256px tileable texture at token opacity *behind* [child].
/// Uses a pre-tinted alpha texture (ink specks on light, pearl specks on dark), so no blend
/// mode or saveLayer is needed. The image is decoded once and cached by Flutter.
class DosaGrain extends StatelessWidget {
  const DosaGrain({super.key, required this.child});

  final Widget child;

  static const String _package = 'dosa_ui';

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    final asset = t.isDark ? 'assets/textures/paper-grain-pearl-256.webp' : 'assets/textures/paper-grain-ink-256.webp';
    // Alpha textures carry ~2× the visual weight of the grey blend tile, so scale opacity to
    // land on the same perceived intensity as web (3.5% light / 4% dark).
    final opacity = (t.grainOpacity * 1.6).clamp(0.0, 1.0);
    return DecoratedBox(
      position: DecorationPosition.background,
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage(asset, package: _package),
          repeat: ImageRepeat.repeat,
          scale: 1,
          alignment: Alignment.topLeft,
          opacity: opacity,
          filterQuality: FilterQuality.none,
        ),
      ),
      child: child,
    );
  }
}

/// Ambient mesh background: four soft radial blobs from theme mesh tokens over the canvas.
/// Static and cheap; place under glass so the blur has light to refract.
class DosaMeshBackground extends StatelessWidget {
  const DosaMeshBackground({super.key, this.quiet = false, this.grain = true, required this.child});

  /// Operational screens: two blobs at half strength.
  final bool quiet;
  final bool grain;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    RadialGradient blob(Alignment at, Color c, double radius, [double strength = 1]) => RadialGradient(
          center: at,
          radius: radius,
          colors: <Color>[c.withValues(alpha: c.a * strength), c.withValues(alpha: 0)],
        );
    final blobs = quiet
        ? <Gradient>[
            blob(const Alignment(-0.76, -0.84), t.meshA, 0.8, 0.5),
            blob(const Alignment(0.56, 0.84), t.meshB, 0.8, 0.5),
          ]
        : <Gradient>[
            blob(const Alignment(-0.76, -0.84), t.meshA, 0.9),
            blob(const Alignment(0.76, -0.72), t.meshB, 0.8),
            blob(const Alignment(0.56, 0.84), t.meshC, 0.9),
            blob(const Alignment(-0.84, 0.72), t.meshD, 0.75),
          ];
    Widget content = child;
    if (grain) content = DosaGrain(child: content);
    return DecoratedBox(
      decoration: BoxDecoration(color: t.backgroundCanvas),
      child: Stack(
        fit: StackFit.passthrough,
        children: <Widget>[
          for (final g in blobs) Positioned.fill(child: IgnorePointer(child: DecoratedBox(decoration: BoxDecoration(gradient: g)))),
          content,
        ],
      ),
    );
  }
}
