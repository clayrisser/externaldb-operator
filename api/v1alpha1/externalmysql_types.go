/**
 * Copyright 2020 Silicon Hills LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// ExternalMysqlSpec defines the desired state of ExternalMysql
type ExternalMysqlSpec struct {
	// name is the name of the database to create
	Name string `json:"name,omitempty"`

	// cleanup will delete the database when the ExternalMysql resource is deleted
	Cleanup bool `json:"cleanup,omitempty"`

        // connection mysql resource
        Connection DatabaseConnection `json:"connection,omitempty"`

	// kustomization to apply after success
	Kustomization KustomizationSpec `json:"kustomization,omitempty" yaml:"kustomization,omitempty"`

	// name of generated secret containing `MYSQL_PASSWORD` or `MYSQL_CONNECITON_URL`
	SecretName string `json:"secretName,omitempty"`

	// name of generated config map containing `MYSQL_HOSTNAME`, `MYSQL_PORT`, `MYSQL_USERNAME` or `MYSQL_DATABASE`
	ConfigMapName string `json:"configMapName,omitempty"`
}

// ExternalMysqlStatus defines the observed state of ExternalMysql
type ExternalMysqlStatus struct {
        // database status (CREATING, DELETING, CREATED, ALREADY_EXISTS OR FAILED)
        Database string `json:"database,omitempty"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// ExternalMysql is the Schema for the externalmysqls API
type ExternalMysql struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ExternalMysqlSpec   `json:"spec,omitempty"`
	Status ExternalMysqlStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// ExternalMysqlList contains a list of ExternalMysql
type ExternalMysqlList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ExternalMysql `json:"items"`
}

func init() {
	SchemeBuilder.Register(&ExternalMysql{}, &ExternalMysqlList{})
}
