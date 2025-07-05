import { App, Position } from '@webos-project/common';
import { IconType } from '@Features/icons/enums/iconType.enum';

interface AppIcon {
  app: App;
}

interface FileIcon {
  path: string;
  type: string; // ToDo: change to file type
}

interface DirectoryIcon {
  path: string;
}

interface CommonIconState {
  position: Position;
  image: string;
}

type AppIconState = {
  type: IconType.App;
  additionalState: AppIcon;
} & CommonIconState;

type FileIconState = {
  type: IconType.File;
  additionalState: FileIcon;
} & CommonIconState;

type DirectoryIconState = {
  type: IconType.Directory;
  additionalState: DirectoryIcon;
} & CommonIconState;

interface IconSliceInitialState {
  icons: Array<DirectoryIconState | FileIconState | AppIconState>;
}

interface AddAppIcon {
  app: App;
  image: string;
}

export type { AddAppIcon, IconSliceInitialState, DirectoryIcon, AppIconState, FileIconState, DirectoryIconState, FileIcon, AppIcon };
