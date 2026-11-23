import 'package:dosa_customer/src/app.dart';
import 'package:dosa_ui/dosa_ui.dart';
import 'package:dosa_ui/testing.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  setUpAll(loadDosaFonts);

  Future<void> pumpApp(WidgetTester tester) async {
    tester.view.physicalSize = const Size(390 * 3, 1500 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(const DosaCustomerApp());
    // SVG and Lottie assets decode asynchronously; give them real time, then advance frames.
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 500)));
    await tester.pump();
    await tester.pump(const Duration(seconds: 2));
  }

  testWidgets('uses the warm customer theme', (tester) async {
    await pumpApp(tester);
    final ctx = tester.element(find.text('Good evening'));
    expect(DosaTheme.of(ctx).name, 'customer-warm');
    expect(Theme.of(ctx).brightness, Brightness.light);
  });

  testWidgets('Add to order uses the Highlight action with ink text', (tester) async {
    await pumpApp(tester);
    final ctx = tester.element(find.text('Add to order'));
    final t = DosaTheme.of(ctx);
    final button = tester.widget<FilledButton>(find.widgetWithText(FilledButton, 'Add to order'));
    expect(button.style!.backgroundColor!.resolve(<WidgetState>{}), t.actionHighlightBg);
    expect(button.style!.foregroundColor!.resolve(<WidgetState>{}), t.actionHighlightFg);
  });

  testWidgets('order status is announced with text', (tester) async {
    final semantics = tester.ensureSemantics();
    await pumpApp(tester);
    expect(find.bySemanticsLabel('Order status: Ready'), findsOneWidget);
    semantics.dispose();
  });

  testWidgets('golden: customer warm', (tester) async {
    await pumpApp(tester);
    await expectLater(find.byType(DosaCustomerApp), matchesGoldenFile('goldens/customer-warm.png'));
  });
}
