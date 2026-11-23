import 'package:flutter_svg/flutter_svg.dart';
import 'package:lottie/lottie.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/dosa_theme.dart';
import '../tokens/dosa_tokens.g.dart';

/// Motion helpers that respect the platform's reduce-motion setting.
abstract final class DosaMotion {
  /// True when the user asked the OS to reduce motion (iOS Reduce Motion, Android
  /// "Remove animations"). Animations must collapse to a static end state.
  static bool reduced(BuildContext context) => MediaQuery.maybeDisableAnimationsOf(context) ?? false;

  /// Duration to use for a UI transition: the token, or zero when motion is reduced.
  static Duration duration(BuildContext context, Duration token) => reduced(context) ? Duration.zero : token;

  /// Standard enter transition for content that appears in place (cards, banners).
  static Widget fadeRise({required Animation<double> animation, required Widget child}) {
    final curved = CurvedAnimation(parent: animation, curve: DosaEasing.decelerate);
    return FadeTransition(
      opacity: curved,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, 0.04), end: Offset.zero).animate(curved),
        child: child,
      ),
    );
  }
}

/// The ten DOSA Lottie animations shipped in `assets/motion/`.
enum DosaAnimation {
  orderReceived('order-received', loop: false),
  orderAccepted('order-accepted', loop: false),
  foodPreparation('food-preparation', loop: true),
  orderReady('order-ready', loop: false),
  paymentSuccess('payment-success', loop: false),
  emptyOrders('empty-orders', loop: true),
  emptyReservations('empty-reservations', loop: true),
  loadingProcessing('loading-processing', loop: true),
  syncSuccess('sync-success', loop: false),
  restaurantOnboarding('restaurant-onboarding', loop: false);

  const DosaAnimation(this.file, {required this.loop});
  final String file;
  final bool loop;
}

/// Plays a DOSA Lottie animation for the current theme brightness. When motion is reduced, or
/// the animation fails to load, shows the static SVG fallback (its poster frame) instead.
class DosaAnimatedIllustration extends StatelessWidget {
  const DosaAnimatedIllustration(
    this.animation, {
    super.key,
    this.width = 240,
    this.height = 180,
    this.semanticLabel,
    this.repeat,
  });

  final DosaAnimation animation;
  final double width;
  final double height;

  /// Accessible description; null marks the illustration as decorative.
  final String? semanticLabel;

  /// Overrides the default looping behaviour of [animation].
  final bool? repeat;

  static const String _package = 'dosa_ui';

  @override
  Widget build(BuildContext context) {
    final mode = DosaTheme.of(context).isDark ? 'dark' : 'light';
    final fallback = SvgPicture.asset(
      'assets/motion/fallbacks/$mode/${animation.file}.svg',
      package: _package,
      width: width,
      height: height,
    );
    final Widget child = DosaMotion.reduced(context)
        ? fallback
        : Lottie.asset(
            'assets/motion/$mode/${animation.file}.json',
            package: _package,
            width: width,
            height: height,
            repeat: repeat ?? animation.loop,
            frameRate: FrameRate.composition,
            errorBuilder: (context, error, stackTrace) => fallback,
          );
    return Semantics(
      container: semanticLabel != null,
      label: semanticLabel,
      image: semanticLabel != null,
      excludeSemantics: true,
      child: ExcludeSemantics(excluding: semanticLabel == null, child: child),
    );
  }
}

/// Static DOSA illustration from the shared library, switching light/dark with the theme.
class DosaIllustration extends StatelessWidget {
  const DosaIllustration(this.name, {super.key, this.width = 240, this.semanticLabel});

  /// File name without extension, e.g. `empty-orders` (see packages/brand-assets/ASSET_INDEX.md).
  final String name;
  final double width;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final mode = DosaTheme.of(context).isDark ? 'dark' : 'light';
    return SvgPicture.asset(
      'assets/illustrations/$mode/$name.svg',
      package: 'dosa_ui',
      width: width,
      height: width * 0.75,
      semanticsLabel: semanticLabel,
      excludeFromSemantics: semanticLabel == null,
    );
  }
}
