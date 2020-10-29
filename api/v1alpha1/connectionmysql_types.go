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

// ConnectionMysqlSpec defines the desired state of ConnectionMysql
type ConnectionMysqlSpec struct {
	// mysql hostname
	Hostname string `json:"foo,omitempty"`

	// mysql port
	Port int64 `json:"foo,omitempty"`

	// mysql username
	Username string `json:"foo,omitempty"`

	// mysql password
	Password string `json:"foo,omitempty"`

	// mysql database name
	Database string `json:"foo,omitempty"`

	// mysql connection url
	Url string `json:"foo,omitempty"`

	// secret name containing `MYSQL_PASSWORD` or `MYSQL_CONNECITON_URL`
	SecretName string `json:"foo,omitempty"`

	// config map name containing `MYSQL_HOSTNAME`, `MYSQL_PORT`, `MYSQL_USERNAME` or `MYSQL_DATABASE`
	ConfigMapName string `json:"foo,omitempty"`
}

// ConnectionMysqlStatus defines the observed state of ConnectionMysql
type ConnectionMysqlStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// ConnectionMysql is the Schema for the connectionmysqls API
type ConnectionMysql struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ConnectionMysqlSpec   `json:"spec,omitempty"`
	Status ConnectionMysqlStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// ConnectionMysqlList contains a list of ConnectionMysql
type ConnectionMysqlList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ConnectionMysql `json:"items"`
}

func init() {
	SchemeBuilder.Register(&ConnectionMysql{}, &ConnectionMysqlList{})
}
