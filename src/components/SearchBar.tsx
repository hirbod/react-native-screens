import React from 'react';
import {
  isSearchBarAvailableForCurrentPlatform,
  SearchBarCommands,
  SearchBarProps,
  RenamedSearchBarProps,
} from 'react-native-screens';
import { View } from 'react-native';

// Native components
import SearchBarNativeComponent, {
  Commands as SearchBarNativeCommands,
} from '../fabric/SearchBarNativeComponent';

export const NativeSearchBar: React.ComponentType<RenamedSearchBarProps> &
  typeof NativeSearchBarCommands =
  SearchBarNativeComponent as unknown as React.ComponentType<RenamedSearchBarProps> &
    SearchBarCommandsType;
export const NativeSearchBarCommands: SearchBarCommandsType =
  SearchBarNativeCommands as SearchBarCommandsType;

type NativeSearchBarRef = React.ElementRef<typeof NativeSearchBar>;

type SearchBarCommandsType = {
  blur: (viewRef: NativeSearchBarRef) => void;
  focus: (viewRef: NativeSearchBarRef) => void;
  clearText: (viewRef: NativeSearchBarRef) => void;
  toggleCancelButton: (viewRef: NativeSearchBarRef, flag: boolean) => void;
  setText: (viewRef: NativeSearchBarRef, text: string) => void;
  cancelSearch: (viewRef: NativeSearchBarRef) => void;
};

function SearchBar(props: SearchBarProps, ref: React.Ref<SearchBarCommands>) {
  const searchBarRef = React.useRef<SearchBarCommands | null>(null);

  React.useImperativeHandle(ref, () => ({
    blur: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
    },
    focus: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
    },
    toggleCancelButton: (flag: boolean) => {
      _callMethodWithRef(ref =>
        NativeSearchBarCommands.toggleCancelButton(ref, flag)
      );
    },
    clearText: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
    },
    setText: (text: string) => {
      _callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
    },
    cancelSearch: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
    },
  }));

  const _callMethodWithRef = React.useCallback(
    (method: (ref: SearchBarCommands) => void) => {
      const ref = searchBarRef.current;
      if (ref) {
        method(ref);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet'
        );
      }
    },
    [searchBarRef]
  );

  if (!isSearchBarAvailableForCurrentPlatform) {
    console.warn(
      'Importing SearchBar is only valid on iOS and Android devices.'
    );
    return View as unknown as React.ReactNode;
  }

  return (
    <NativeSearchBar
      onSearchFocus={props.onFocus}
      onSearchBlur={props.onBlur}
      {...props}
      ref={searchBarRef}
    />
  );
}

export default React.forwardRef<SearchBarCommands, SearchBarProps>(SearchBar);
