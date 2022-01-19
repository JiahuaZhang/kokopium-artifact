import { atom, selectorFamily } from 'recoil';
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
    const currentAllArtifactDomains = get(allArtifactDomainsState);

    switch (param) {
      case 'init':
        set(allArtifactDomainsState, data);
        break;
      case 'add':
        set(allArtifactDomainsState, [...currentAllArtifactDomains, ...(data as Artifact_Domain[])]);
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
    const allArtifactDomains = get(allArtifactDomainsState);
    let newAllArtifactDomains = allArtifactDomains;

    switch (type) {
      case 'add':
        newAllArtifactDomains = allArtifactDomains.map(domain => {
          if (domain.id === domainId) {
            return { ...domain, artifacts: [...domain.artifacts, { ...data, id: v4() } as Artifact] };
          }
          return domain;
        });
        break;
      case 'delete':
        newAllArtifactDomains = allArtifactDomains.map(domain => {
          if (domain.id === domainId) {
            return { ...domain, artifacts: domain.artifacts.filter(artifact => artifact.id !== (data as Artifact).id) };
          }
          return domain;
        });
        break;
      case 'update':
        newAllArtifactDomains = allArtifactDomains.map(domain => {
          if (domain.id === domainId) {
            return {
              ...domain, artifacts: domain.artifacts.map(
                artifact => {
                  if (artifact.id === (data as Artifact).id) {
                    return data as Artifact;
                  } else {
                    return artifact;
                  }
                }
              )
            };
          }
          return domain;
        });
        break;
      default:
        break;
    }

    set(allArtifactDomainsState, newAllArtifactDomains);
  }
});