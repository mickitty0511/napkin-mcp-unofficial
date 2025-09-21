# Napkin API Changelog

> **Source:** https://api.napkin.ai/docs/changelog

This is the changelog for the Napkin AI API.

## V0.7.0 (2025-08-29)

**ADDED**
- Add support for custom fonts in svg and png exports

## V0.6.2 (2025-08-29)

**FIXED**
- Improve orientation handling to better match requested orientation
- Fix case where requests were failing due to an internal error

## V0.6.1 (2025-08-21)

**FIXED**
- Fix orientation not correctly being applied to visuals

**IMPROVED**
- Make processing faster in case several visuals are specified in the request

## V0.6.0 (2025-08-14)

**ADDED**
- Support for ppt export (PowerPoint). Note: PPT export does not support custom fonts — any non-default fonts will be substituted with system defaults when generating slides.

## V0.5.1 (2025-08-12)

**ADDED**
- Add orientation parameter for specifying the orientation of the generated visual

**DEPRECATED**
- Deprecate context_before and context_after parameters in favor of context (will be removed in a future version)

## V0.4.0 (2025-08-01)

**ADDED**
- Support for visual_query and visual_queries parameters for searching visual types

## V0.3.2 (2025-07-30)

**IMPROVED**
- Make processing faster in case several visuals are specified in the request (using visual_ids)

## V0.3.1 (2025-07-25)

**IMPROVED**
- Make processing faster in case several visuals are generated using the same visual ID

## V0.3.0 (2025-07-24)

**ADDED**
- Support of custom styles for visual requests (see available styles for more information)

## V0.2.4 (2025-07-23)

**FIXED**
- Fix style_id not being used during visual request processing

## V0.2.3 (2025-07-22)

**FIXED**
- Fix number_of_visuals not being optional

## V0.2.2 (2025-07-21)

**ADDED**
- Initial release of the Napkin AI API