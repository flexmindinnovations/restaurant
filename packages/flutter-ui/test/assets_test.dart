import 'dart:io';

import 'package:dosa_ui/dosa_ui.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';
import 'package:material_ui/material_ui.dart';

/// Parses every bundled SVG with flutter_svg and every Lottie file with the Flutter lottie
/// parser, so assets are proven to work on the Flutter renderer, not just in browsers.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  List<File> files(String dir, String ext) =>
      Directory(dir).listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith(ext)).toList()
        ..sort((a, b) => a.path.compareTo(b.path));

  test('all SVG assets parse with flutter_svg', () async {
    final svgs = [...files('assets/brand', '.svg'), ...files('assets/illustrations', '.svg'), ...files('assets/motion/fallbacks', '.svg')];
    expect(svgs.length, greaterThanOrEqualTo(8 + 46 + 20));
    for (final f in svgs) {
      final info = await vg.loadPicture(SvgStringLoader(f.readAsStringSync()), null);
      expect(info.size.width, greaterThan(0), reason: f.path);
      info.picture.dispose();
    }
  });

  test('all Lottie files parse with the Flutter lottie package', () async {
    final jsons = files('assets/motion', '.json');
    expect(jsons, hasLength(20));
    for (final f in jsons) {
      final comp = await LottieComposition.fromBytes(f.readAsBytesSync());
      expect(comp.bounds.width, 240, reason: f.path);
      expect(comp.duration, greaterThan(Duration.zero), reason: f.path);
      expect(comp.warnings, isEmpty, reason: '${f.path}: ${comp.warnings}');
    }
  });

  testWidgets('DosaAnimatedIllustration shows the static fallback when motion is reduced', (tester) async {
    await tester.pumpWidget(MaterialApp(
      theme: buildDosaTheme(DosaThemeTokens.staffLight),
      home: const MediaQuery(
        data: MediaQueryData(disableAnimations: true),
        child: DosaAnimatedIllustration(DosaAnimation.orderReady),
      ),
    ));
    expect(find.byType(SvgPicture), findsOneWidget);
    expect(find.byType(LottieBuilder), findsNothing);
  });

  testWidgets('DosaAnimatedIllustration plays Lottie when motion is allowed', (tester) async {
    await tester.pumpWidget(MaterialApp(
      theme: buildDosaTheme(DosaThemeTokens.customerWarm),
      home: const DosaAnimatedIllustration(DosaAnimation.paymentSuccess),
    ));
    expect(find.byType(LottieBuilder), findsOneWidget);
  });
}
