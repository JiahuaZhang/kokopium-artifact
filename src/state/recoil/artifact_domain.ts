import produce from 'immer';
import { atom, DefaultValue, selectorFamily } from 'recoil';
import { v4 } from 'uuid';
import { Artifact, Artifact_Domain } from '../artifact';

export const allArtifactDomainsState = atom<Artifact_Domain[]>({
  key: 'allArtifactDomainsState',
  default: []
});

export type AllArtifactDomainsParams = 'init' | 'fetch' | 'add' | 'delete' | 'update' | string;

export const processedAllArtifactDomainsState = selectorFamily<Artifact_Domain[], AllArtifactDomainsParams>({
  key: 'processedAllArtifactDomainsState',
  get: (param) => ({ get }) => {
    const allArtifactDomains = get(allArtifactDomainsState);
    return allArtifactDomains.filter(d => d.id === param);
  },
  set: (param) => ({ get, set }, data) => {
    if (data instanceof DefaultValue) return;

    const currentAllArtifactDomains = get(allArtifactDomainsState);

    switch (param) {
      case 'init':
        set(allArtifactDomainsState, data);
        break;
      case 'add':
        set(allArtifactDomainsState, produce(currentAllArtifactDomains, draft => {
          draft.push(...data);
        }));
        break;
      case 'delete':
        const filteredAllArtifactDomains = currentAllArtifactDomains.filter(domain => !(data as Artifact_Domain[]).some(d => d.id === domain.id));
        set(allArtifactDomainsState, filteredAllArtifactDomains);
        break;
      case 'update':
        const updatedAllArtifactDomains = currentAllArtifactDomains.map(domain => {
          const newDomain = (data as Artifact_Domain[]).find(d => d.id === domain.id);
          if (newDomain) return newDomain;
          return domain;
        });
        set(allArtifactDomainsState, updatedAllArtifactDomains);
        break;
      default:
        break;
    }
  }
});

export type ArtifactParams = {
  domainId: string;
  artifactId?: string;
  type: 'add' | 'delete' | 'update' | 'fetch';
};

export const processArtifactState = selectorFamily<Artifact, ArtifactParams>({
  key: 'processArtifactState',
  get: ({ domainId, artifactId, type }) => ({ get }) => {
    if (type !== 'fetch' || !artifactId) return { rarity: 5 } as Artifact;

    const allArtifactDomains = get(allArtifactDomainsState);
    return allArtifactDomains.find(domain => domain.id === domainId)?.artifacts
      .find(artifact => artifact.id === artifactId)!;
  },
  set: ({ domainId, artifactId, type }) => ({ get, set }, data) => {
    if (data instanceof DefaultValue) return;

    const allArtifactDomains = get(allArtifactDomainsState);
    let newAllArtifactDomains: Artifact_Domain[] = [];
    let index = -1;

    switch (type) {
      case 'add':
        index = allArtifactDomains.findIndex(val => val.id === domainId);
        if (index === -1) break;

        newAllArtifactDomains = produce(allArtifactDomains, draft => {
          draft[index] = produce(draft[index], d => {
            d.artifacts.push(
              { ...data, id: v4() }
            );
          });
        });
        break;
      case 'delete':
        index = allArtifactDomains.findIndex(val => val.id === domainId);
        if (index === -1) break;

        newAllArtifactDomains = produce(allArtifactDomains, draft => {
          const artifactIndex = draft[index].artifacts.findIndex(val => val.id === data.id);
          if (artifactIndex === -1) return;

          draft[index].artifacts.splice(artifactIndex, 1);
        });
        break;
      case 'update':
        index = allArtifactDomains.findIndex(val => val.id === domainId);
        if (index === -1) break;

        newAllArtifactDomains = produce(allArtifactDomains, draft => {
          const artifactIndex = draft[index].artifacts.findIndex(val => val.id === data.id);
          if (artifactIndex === -1) return;

          draft[index].artifacts[artifactIndex] = data;
        });
        break;
      default:
        break;
    }

    set(allArtifactDomainsState, newAllArtifactDomains);
  }
});