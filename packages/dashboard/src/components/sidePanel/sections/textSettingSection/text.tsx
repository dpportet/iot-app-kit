import type { FC, MouseEventHandler, ReactNode } from 'react';
import React from 'react';
import type { NonCancelableCustomEvent, SelectProps } from '@cloudscape-design/components';
import { ExpandableSection, Select, SpaceBetween } from '@cloudscape-design/components';
import * as awsui from '@cloudscape-design/design-tokens';
import { fontFamilyBase, fontFamilyMonospace } from '@cloudscape-design/design-tokens';
import ColorPicker from '../../shared/colorPicker';
import { useWidgetLense } from '../../utils/useWidgetLense';
import type { DashboardMessages } from '~/messages';
import type { TextWidget } from '~/customization/widgets/types';
import { Widget } from '~/types';

import './index.css';

export const isTextWidget = (widget: Widget): widget is TextWidget => widget.type === 'text';

export type TextComponentProps = {
  messageOverride: DashboardMessages;
};

interface ButtonWithStateProps {
  checked: boolean;
  onToggle: MouseEventHandler;
  children: ReactNode;
}

const ButtonWithState: FC<ButtonWithStateProps> = ({
  checked,
  children,
  onToggle,
  ...others // passing other attributes like data-test-id
}) => {
  return (
    <div
      role='checkbox'
      aria-checked={checked}
      {...others}
      className={`text-button-toggle ${checked ? 'checked' : ''}`}
      onClick={onToggle}
    >
      {children}
    </div>
  );
};

const fontLabelMap: { [font: string]: string } = {
  [fontFamilyBase]: 'Base font',
  [fontFamilyMonospace]: 'Mono Space',
  unset: 'Unset',
};
const getFontLabel = (font: string) => {
  return fontLabelMap[font] || font;
};

const fontOptions = Object.keys(fontLabelMap).map((key) => ({
  label: getFontLabel(fontLabelMap[key]),
  value: fontLabelMap[key],
}));

const fontSizeOptions = [8, 10, 12, 14, 16, 20, 24, 32, 48].map((size) => ({
  label: `${size} px`,
  value: `${size}`,
}));

const defaultMessages = {
  title: 'Text',
  font: 'Font',
  color: 'Color',
  style: 'Style',
  size: 'Size',
  horizontal: 'Horizontal',
  vertical: 'Vertical',
};

const TextSettings: FC<TextWidget> = (widget) => {
  const [font = 'unset', updateFont] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.fontSettings?.fontFamily,
    (w, fontFamily) => ({
      ...w,
      properties: { ...w.properties, fontSettings: { ...w.properties.fontSettings, fontFamily } },
    })
  );

  const [color = '#000000', updateColor] = useWidgetLense<TextWidget, string | undefined>(
    widget,
    (w) => w.properties.fontSettings?.fontColor,
    (w, fontColor) => ({
      ...w,
      properties: { ...w.properties, fontSettings: { ...w.properties.fontSettings, fontColor } },
    })
  );

  const [bold = false, toggleBold] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isBold,
    (w, isBold) => ({
      ...w,
      properties: { ...w.properties, fontSettings: { ...w.properties.fontSettings, isBold } },
    })
  );

  const [italic = false, toggleItalic] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isItalic,
    (w, isItalic) => ({
      ...w,
      properties: {
        ...w.properties,
        fontSettings: { ...w.properties.fontSettings, isItalic },
      },
    })
  );

  const [underline = false, toggleUnderline] = useWidgetLense<TextWidget, boolean | undefined>(
    widget,
    (w) => w.properties.fontSettings?.isUnderlined,
    (w, isUnderlined) => ({
      ...w,
      properties: {
        ...w.properties,
        fontSettings: { ...w.properties.fontSettings, isUnderlined },
      },
    })
  );

  const [fontSize = 16, updateSize] = useWidgetLense<TextWidget, number | undefined>(
    widget,
    (w) => w.properties.fontSettings?.fontSize,
    (w, fontSize) => ({
      ...w,
      properties: { ...w.properties, fontSettings: { ...w.properties.fontSettings, fontSize } },
    })
  );

  const onFontChange = ({
    detail: {
      selectedOption: { value },
    },
  }: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => {
    if (value) {
      updateFont(value);
    }
  };

  const onFontSizeChange = ({
    detail: {
      selectedOption: { value },
    },
  }: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => {
    if (value) {
      updateSize(parseInt(value, 10));
    }
  };

  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <div className='text-configuration' style={{ gap: awsui.spaceScaledS }}>
        <label>{defaultMessages.font}</label>
        <Select
          selectedOption={{ label: getFontLabel(font), value: font }}
          options={fontOptions}
          onChange={onFontChange}
          data-test-id='text-widget-setting-font-dropdown'
        />

        <label>{defaultMessages.color}</label>
        <ColorPicker color={color} updateColor={updateColor} />

        <label>{defaultMessages.style}</label>
        <SpaceBetween size='xxs' direction='horizontal'>
          <ButtonWithState aria-label='toggle bold text' checked={bold} onToggle={() => toggleBold(!bold)}>
            <b>B</b>
          </ButtonWithState>
          <ButtonWithState aria-label='toggle italicize text' checked={italic} onToggle={() => toggleItalic(!italic)}>
            <i>I</i>
          </ButtonWithState>
          <ButtonWithState
            aria-label='toggle underline text'
            checked={underline}
            onToggle={() => toggleUnderline(!underline)}
          >
            <u>U</u>
          </ButtonWithState>
        </SpaceBetween>

        <label>{defaultMessages.size}</label>
        <Select
          selectedOption={{ label: `${fontSize} px`, value: `${fontSize}` }}
          options={fontSizeOptions}
          onChange={onFontSizeChange}
          ariaLabel='dropdown font size'
          data-test-id='text-widget-setting-font-size'
        />

        <label>{defaultMessages.horizontal}</label>
        <Select selectedOption={null} disabled data-test-id='text-widget-setting-horizontal-align' />
        <label>{defaultMessages.vertical}</label>
        <Select selectedOption={null} disabled data-test-id='text-widget-setting-vertical-align' />
      </div>
    </ExpandableSection>
  );
};

export default TextSettings;
