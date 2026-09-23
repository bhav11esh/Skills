/**
 * Swizzled (ejected) LocaleDropdownNavbarItem.
 *
 * Why we fork: strip every leading locale segment before rebuilding links so soft-404
 * hosts cannot stack /fr/th/es/... prefixes (see prior comments).
 *
 * Dev caveat: `docusaurus start` only serves ONE locale (the one passed via --locale,
 * or defaultLocale). Switching languages in the dropdown would 404. In development we
 * intercept non-current locale clicks and tell you how to restart with that locale.
 * Production `yarn build` + serve includes all locales and uses normal navigation.
 */
import React, {type ReactNode} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useLocation} from "@docusaurus/router";
import {translate} from "@docusaurus/Translate";
import {mergeSearchStrings, useHistorySelector} from "@docusaurus/theme-common";
import DropdownNavbarItem from "@theme/NavbarItem/DropdownNavbarItem";
import IconLanguage from "@theme/Icon/Language";
import type {LinkLikeNavbarItemProps} from "@theme/NavbarItem";
import type {Props} from "@theme/NavbarItem/LocaleDropdownNavbarItem";

import styles from "./styles.module.css";

function isLocaleSegment(seg: string): boolean {
  return /^[a-z]{2}$/.test(seg) || seg === "ind" || /^zh-Han[st]$/.test(seg);
}

function stripLeadingLocales(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0 && isLocaleSegment(segments[0]!)) {
    segments.shift();
  }
  return segments.join("/");
}

function useLocaleDropdownUtils() {
  const {
    siteConfig,
    i18n: {localeConfigs},
  } = useDocusaurusContext();
  const {pathname} = useLocation();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  const getLocaleConfig = (locale: string) => {
    const localeConfig = localeConfigs[locale];
    if (!localeConfig) {
      throw new Error(`Docusaurus bug, no locale config found for locale=${locale}`);
    }
    return localeConfig;
  };

  const pathnameSuffix = stripLeadingLocales(pathname);

  const getBaseURLForLocale = (locale: string) => {
    const localeConfig = getLocaleConfig(locale);
    const localizedPath = `${localeConfig.baseUrl}${pathnameSuffix}`;
    const isSameDomain = localeConfig.url === siteConfig.url;
    if (isSameDomain) {
      return `pathname://${localizedPath}`;
    }
    return `${localeConfig.url}${localizedPath}`;
  };

  return {
    getURL: (locale: string, options: {queryString: string | undefined}) => {
      const finalSearch = mergeSearchStrings([search, options.queryString], "append");
      return `${getBaseURLForLocale(locale)}${finalSearch}${hash}`;
    },
    getLabel: (locale: string) => getLocaleConfig(locale).label,
    getLang: (locale: string) => getLocaleConfig(locale).htmlLang,
  };
}

const isDev = process.env.NODE_ENV === "development";

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  queryString,
  ...props
}: Props): ReactNode {
  const utils = useLocaleDropdownUtils();

  const {
    i18n: {currentLocale, locales},
  } = useDocusaurusContext();

  const localeItems = locales.map((locale): LinkLikeNavbarItemProps => {
    const isCurrent = locale === currentLocale;
    // Dev server is single-locale — navigating to /zh-Hans/ etc. hits Not Found.
    if (isDev && !isCurrent) {
      return {
        label: utils.getLabel(locale),
        lang: utils.getLang(locale),
        href: "#",
        target: "_self",
        autoAddBaseUrl: false,
        className: "",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          window.alert(
            [
              `This dev server is only running “${utils.getLabel(currentLocale)}” (${currentLocale}).`,
              ``,
              `Docusaurus start loads one language at a time. To preview “${utils.getLabel(locale)}”:`,
              ``,
              `  yarn start --locale ${locale} --port 3000`,
              ``,
              `Or build all languages and serve:`,
              ``,
              `  yarn build && yarn serve`,
            ].join("\n"),
          );
        },
      };
    }

    return {
      label: utils.getLabel(locale),
      lang: utils.getLang(locale),
      to: utils.getURL(locale, {queryString}),
      target: "_self",
      autoAddBaseUrl: false,
      className:
        // eslint-disable-next-line no-nested-ternary
        isCurrent
          ? mobile
            ? "menu__link--active"
            : "dropdown__link--active"
          : "",
    };
  });

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter];

  const dropdownLabel = mobile
    ? translate({
        message: "Languages",
        id: "theme.navbar.mobileLanguageDropdown.label",
        description: "The label for the mobile language switcher dropdown",
      })
    : utils.getLabel(currentLocale);

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}
