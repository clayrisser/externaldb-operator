/*


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// ExternalMongoSpec defines the desired state of ExternalMongo
type ExternalMongoSpec struct {
	// name is the name of the database to create
	Name string `json:"name,omitempty"`

	// cleanup will delete the database when the ExternalMongo resource is deleted
	Cleanup bool `json:"cleanup,omitempty"`

        // connection mongo resource
        Connection DatabaseConnection `json:"connection,omitempty"`

	// kustomization to apply after success
	Kustomization KustomizationSpec `json:"kustomization,omitempty" yaml:"kustomization,omitempty"`
}

// ExternalMongoStatus defines the observed state of ExternalMongo
type ExternalMongoStatus struct {
        // database status (CREATING, DELETING, CREATED, ALREADY_EXISTS OR FAILED)
        Database string `json:"database,omitempty"`
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// ExternalMongo is the Schema for the externalmongoes API
type ExternalMongo struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ExternalMongoSpec   `json:"spec,omitempty"`
	Status ExternalMongoStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// ExternalMongoList contains a list of ExternalMongo
type ExternalMongoList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ExternalMongo `json:"items"`
}

func init() {
	SchemeBuilder.Register(&ExternalMongo{}, &ExternalMongoList{})
}
