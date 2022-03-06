import produce from 'immer';
import { atom, DefaultValue, selectorFamily } from 'recoil';
import { v4 } from 'uuid';
import { Enhanced_Artifact } from '../artifact';

export const allEnhancedArtiifactsState = atom<Enhanced_Artifact[]>({
  key: 'allEnhancedArtiifactsState',
  default: []
});

export type AllEnhancedArtifactsParams = 'init' | 'fetch' | 'add' | 'delete' | 'update' | string;

export const handleAllArtifactEnhancementsState = selectorFamily<Enhanced_Artifact[], AllEnhancedArtifactsParams>({
  key: "handleAllArtifactEnhancementsState",
  get: param => ({ get }) => {
    const allEnhancedArtiifacts = get(allEnhancedArtiifactsState);
    return allEnhancedArtiifacts.filter(d => d.artifact.id === param);
  },
  set: param => ({ get, set }, data) => {
    if (data instanceof DefaultValue) return;

    const allEnhancedArtiifacts = get(allEnhancedArtiifactsState);

    switch (param) {
      case 'init':
        set(allEnhancedArtiifactsState, data);
        break;
      case 'add':
        set(allEnhancedArtiifactsState, produce(allEnhancedArtiifacts, draft => {
          data.push(...data);
        }));
        break;
      case 'delete':
        const filteredState = allEnhancedArtiifacts.filter(enhance => (data).some(a => a.artifact.id === enhance.artifact.id));
        set(allEnhancedArtiifactsState, filteredState);
        break;
      case 'update':
        const updatedState = allEnhancedArtiifacts.map(
          enhance => {
            const newEnhance = (data).find(d => d.artifact.id === enhance.artifact.id);
            if (newEnhance) return newEnhance;
            return enhance;
          }
        );
        set(allEnhancedArtiifactsState, updatedState);
        break;
    }
  }
});

export type EnhanceArtifactParams = 'add' | 'delete' | 'update' | string;

export const handleEnhanceArtifactState = selectorFamily<Enhanced_Artifact, EnhanceArtifactParams>({
  key: 'handleEnhanceArtifactState',
  get: (param) => ({ get }) => {
    if (!param) return {} as Enhanced_Artifact;

    const allEnhancedArtiifacts = get(allEnhancedArtiifactsState);
    return allEnhancedArtiifacts.find(enhance => enhance.artifact.id === param)!;
  },
  set: params => ({ get, set }, data) => {
    if (data instanceof DefaultValue) return;

    const allEnhancedArtiifacts = get(allEnhancedArtiifactsState);
    let newAllEnhancedArtiifacts: Enhanced_Artifact[] = [];
    let index = -1;

    switch (params) {
      case 'add':
        data.artifact.id = v4();
        data.artifact.sub_stats = data.artifact.sub_stats.filter(stat => stat.stat && stat.value).map(stat => ({ ...stat, value: Number(stat.value) }));
        data.enhancements = data.enhancements.filter(stat => stat.stat && stat.value).map(enhance => ({ ...enhance, value: Number(enhance.value) }));
        newAllEnhancedArtiifacts = produce(allEnhancedArtiifacts, draft => { draft.push(data); });
        break;
      case 'delete':
        index = allEnhancedArtiifacts.findIndex(val => val.artifact.id === data.artifact.id);
        if (index === -1) break;

        newAllEnhancedArtiifacts = produce(allEnhancedArtiifacts, draft => {
          draft.splice(index, 1);
        });
        break;
      case 'update':
        index = allEnhancedArtiifacts.findIndex(val => val.artifact.id === data.artifact.id);
        if (index === -1) break;

        newAllEnhancedArtiifacts = produce(allEnhancedArtiifacts, draft => {
          data.artifact.sub_stats = data.artifact.sub_stats.filter(stat => stat.stat && stat.value).map(stat => ({ ...stat, value: Number(stat.value) }));
          data.enhancements = data.enhancements.filter(stat => stat.stat && stat.value).map(enhance => ({ ...enhance, value: Number(enhance.value) }));
          draft[index] = data;
        });
        break;
      default:
        break;
    }

    set(allEnhancedArtiifactsState, newAllEnhancedArtiifacts);
  }
});